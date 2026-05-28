import { useEffect, useMemo, useState } from 'react';
import { File as FileIcon, Film, Music, X } from 'lucide-react';

import { uploadFileWithProgress } from '@/graphql/attachments';
import { prepareAudio } from '@/helpers/attachments/prepareAudio';
import { prepareVideo } from '@/helpers/attachments/prepareVideo';
import { AttachmentId, UploadedAttachment } from '@/types/attachments';

import styles from './MessageEditorAttachment.module.css';

type UploadedProps = {
    attachment: UploadedAttachment;
    onDelete(attachmentId: AttachmentId): void;
};

type PendingProps = {
    draftId: string;
    file: globalThis.File;
    compress: boolean;
    onUploaded(draftId: string, attachment: UploadedAttachment): void;
    onDelete(draftId: string): void;
};

type Props = UploadedProps | PendingProps;

const isPendingAttachment = (props: Props): props is PendingProps => 'file' in props;

const getAttachmentType = (mimeType: string): 'image' | 'gif' | 'video' | 'audio' | 'binary' => {
    if (mimeType === 'image/gif') {
        return 'gif';
    }

    if (mimeType.startsWith('image/')) {
        return 'image';
    }

    if (mimeType.startsWith('video/')) {
        return 'video';
    }

    if (mimeType.startsWith('audio/')) {
        return 'audio';
    }

    return 'binary';
};

const getUploadMimeType = (file: File, shouldProcessFile: boolean) => {
    if (!shouldProcessFile) {
        return file.type;
    }

    if (file.type.startsWith('audio/')) {
        return 'audio/mpeg';
    }

    if (file.type.startsWith('video/')) {
        return 'video/mp4';
    }

    return file.type;
};

const ProgressBar = ({ label, progress }: { label: string; progress: number }) => {
    const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));

    return (
        <div className={styles.progress}>
            <div className={styles.progressLabel}>
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
};

export const MessageEditorAttachment = (props: Props) => {
    const isPending = isPendingAttachment(props);
    const pendingFile = isPending ? props.file : null;
    const pendingDraftId = isPending ? props.draftId : null;
    const pendingCompress = isPending ? props.compress : false;
    const pendingOnUploaded = isPending ? props.onUploaded : null;
    const uploadedInput = isPending ? null : props.attachment;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadedAttachment, setUploadedAttachment] = useState<UploadedAttachment | null>(
        isPending ? null : props.attachment,
    );
    const [conversionProgress, setConversionProgress] = useState<number | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(isPending ? 0 : null);
    const [error, setError] = useState<string | null>(null);

    const sourceUrl = uploadedAttachment?.s3Url ?? previewUrl;
    const mimeType = uploadedAttachment?.mimeType ?? pendingFile?.type ?? uploadedInput?.mimeType ?? '';
    const fileName = pendingFile?.name;
    const attachmentType = getAttachmentType(mimeType);

    useEffect(() => {
        if (!pendingFile) {
            setUploadedAttachment(uploadedInput);
            return;
        }

        const url = URL.createObjectURL(pendingFile);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [pendingFile, uploadedInput]);

    useEffect(() => {
        if (!pendingFile || !pendingDraftId || !pendingOnUploaded) {
            return;
        }

        const abortController = new AbortController();
        const isVideo = pendingFile.type.startsWith('video/');
        const isAudio = pendingFile.type.startsWith('audio/');
        const shouldProcessFile = pendingCompress && (isVideo || isAudio);

        const upload = async () => {
            try {
                let preprocessedBlob: Blob = pendingFile;

                if (shouldProcessFile) {
                    setConversionProgress(0);
                    if (isAudio) {
                        preprocessedBlob = await prepareAudio(pendingFile, abortController, setConversionProgress);
                    } else if (isVideo) {
                        preprocessedBlob = await prepareVideo(pendingFile, abortController, setConversionProgress);
                    }
                    setConversionProgress(1);
                }

                setUploadProgress(0);
                const attachment = await uploadFileWithProgress(
                    preprocessedBlob,
                    pendingFile.name,
                    getUploadMimeType(pendingFile, shouldProcessFile),
                    setUploadProgress,
                    abortController.signal,
                );
                setUploadedAttachment(attachment);
                pendingOnUploaded(pendingDraftId, attachment);
            } catch (uploadError) {
                if (abortController.signal.aborted) {
                    return;
                }

                setError((uploadError as Error).message);
            }
        };

        void upload();

        return () => abortController.abort();
    }, [pendingCompress, pendingDraftId, pendingFile, pendingOnUploaded]);

    const preview = useMemo(() => {
        if (!sourceUrl) {
            return (
                <div className={styles.fallbackPreview}>
                    <FileIcon size={28} />
                </div>
            );
        }

        switch (attachmentType) {
            case 'image':
            case 'gif':
                return <img className={styles.previewMedia} src={sourceUrl} alt={fileName ?? 'Attachment'} />;
            case 'video':
                return <video className={styles.previewMedia} src={sourceUrl} muted playsInline preload="metadata" />;
            case 'audio':
                return (
                    <div className={styles.fallbackPreview}>
                        <Music size={28} />
                        <span>{fileName ?? 'Audio'}</span>
                    </div>
                );
            case 'binary':
                return (
                    <div className={styles.fallbackPreview}>
                        {mimeType.startsWith('video/') ? <Film size={28} /> : <FileIcon size={28} />}
                        <span>{fileName ?? 'File'}</span>
                    </div>
                );
        }
    }, [attachmentType, fileName, mimeType, sourceUrl]);

    const handleDelete = () => {
        if (isPending) {
            props.onDelete(props.draftId);
            return;
        }

        props.onDelete(props.attachment.attachmentId);
    };

    return (
        <div className={styles.container}>
            {preview}
            <button className={styles.deleteButton} type="button" onClick={handleDelete} aria-label="Delete attachment">
                <X size={12} />
            </button>
            {conversionProgress != null && conversionProgress < 1 && (
                <ProgressBar label="Convert" progress={conversionProgress} />
            )}
            {uploadProgress != null && uploadProgress < 1 && (
                <ProgressBar label="Upload" progress={uploadProgress} />
            )}
            {error && <div className={styles.error}>{error}</div>}
        </div>
    );
};
