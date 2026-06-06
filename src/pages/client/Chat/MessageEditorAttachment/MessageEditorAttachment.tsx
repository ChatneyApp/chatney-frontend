import { useEffect, useMemo, useState } from 'react';
import { Music, X } from 'lucide-react';

import { uploadFileWithProgress } from '@/graphql/attachments';
import { getAttachmentType, getFileIcon } from '@/helpers/attachments/attachmentDisplay';
import { preprocessAudio, preprocessVideo } from '@/helpers/attachments/ffmpeg';
import { canPrepareImage, getSupportedImageMimeType, prepareImage } from '@/helpers/attachments/prepareImage';
import { readAttachmentMetadata } from '@/helpers/attachments/readAttachmentMetadata';
import { formatFileSize } from '@/helpers/utils';
import { ProgressBar } from '@/pages/client/Chat/ProgressBar';
import { Attachment, AttachmentId } from '@/types/attachments';

import styles from './MessageEditorAttachment.module.css';

type UploadedProps = {
    attachment: Attachment;
    onDelete(attachmentId: AttachmentId): void;
};

type PendingProps = {
    draftId: string;
    file: globalThis.File;
    compress: boolean;
    asFile: boolean;
    onUploaded(draftId: string, attachment: Attachment): void;
    onDelete(draftId: string): void;
};

type Props = UploadedProps | PendingProps;

const getAttachmentUrl = (attachment: Attachment) => `http://localhost:9000/chatney/${attachment.urlPath}`;

const isPendingAttachment = (props: Props): props is PendingProps => 'file' in props;

const getDisplayAttachmentType = (mimeType: string, asFile: boolean) => {
    if (asFile) {
        return 'binary';
    }

    return getAttachmentType(mimeType);
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

export const MessageEditorAttachment = (props: Props) => {
    const isPending = isPendingAttachment(props);
    const pendingFile = isPending ? props.file : null;
    const pendingDraftId = isPending ? props.draftId : null;
    const pendingCompress = isPending ? props.compress : false;
    const inputAsFile = isPending ? props.asFile : props.attachment.asFile;
    const pendingOnUploaded = isPending ? props.onUploaded : null;
    const uploadedInput = isPending ? null : props.attachment;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadedAttachment, setUploadedAttachment] = useState<Attachment | null>(
        isPending ? null : props.attachment,
    );
    const [conversionProgress, setConversionProgress] = useState<number | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number | null>(isPending ? 0 : null);
    const [error, setError] = useState<string | null>(null);

    const sourceUrl = uploadedAttachment?.urlPath ? getAttachmentUrl(uploadedAttachment) : previewUrl;
    const mimeType = uploadedAttachment?.mimeType ?? pendingFile?.type ?? uploadedInput?.mimeType ?? '';
    const asFile = uploadedAttachment?.asFile ?? inputAsFile;
    const fileSize = uploadedAttachment?.size ?? pendingFile?.size ?? uploadedInput?.size;
    const fileName = uploadedAttachment?.originalFileName ?? pendingFile?.name ?? uploadedInput?.originalFileName;
    const contentAttachmentType = getAttachmentType(mimeType);
    const attachmentType = getDisplayAttachmentType(mimeType, asFile);

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
        const isProcessableImage = canPrepareImage(pendingFile);
        const shouldProcessFile = !inputAsFile && (
            isProcessableImage || (pendingCompress && (isVideo || isAudio))
        );

        const upload = async () => {
            try {
                let preprocessedBlob: Blob = pendingFile;

                if (shouldProcessFile) {
                    if (isAudio) {
                        setConversionProgress(0);
                        preprocessedBlob = await preprocessAudio(pendingFile, {}, (progress) => {
                            setConversionProgress(progress);
                            console.log(`audio conversion progress: ${Math.floor(progress * 100)}%`);
                        }, abortController.signal);
                        setConversionProgress(1);
                    } else if (isVideo) {
                        setConversionProgress(0);
                        preprocessedBlob = await preprocessVideo(pendingFile, {}, (progress) => {
                            setConversionProgress(progress);
                            console.log(`video conversion progress: ${Math.floor(progress * 100)}%`);
                        }, abortController.signal);
                        setConversionProgress(1);
                    } else if (isProcessableImage) {
                        preprocessedBlob = await prepareImage(pendingFile);
                    }
                }

                setUploadProgress(0);
                const uploadMimeType = preprocessedBlob.type
                    || getSupportedImageMimeType(pendingFile)
                    || getUploadMimeType(pendingFile, shouldProcessFile);
                const metadata = await readAttachmentMetadata(preprocessedBlob, uploadMimeType, inputAsFile);
                const attachment = await uploadFileWithProgress(
                    preprocessedBlob,
                    pendingFile.name,
                    uploadMimeType,
                    inputAsFile,
                    metadata,
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
    }, [inputAsFile, pendingCompress, pendingDraftId, pendingFile, pendingOnUploaded]);

    const preview = useMemo(() => {
        if (!sourceUrl) {
            return (
                <div className={styles.fallbackPreview}>
                    {getFileIcon(contentAttachmentType, { size: 28 })}
                    {fileName && <span>{fileName}</span>}
                    {fileSize != null && <span className={styles.fileSize}>{formatFileSize(fileSize)}</span>}
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
                        {getFileIcon(contentAttachmentType, { size: 28 })}
                        {fileName && <span>{fileName}</span>}
                        {fileSize != null && <span className={styles.fileSize}>{formatFileSize(fileSize)}</span>}
                    </div>
                );
        }
    }, [attachmentType, contentAttachmentType, fileName, fileSize, sourceUrl]);

    const handleDelete = () => {
        if (isPending) {
            props.onDelete(props.draftId);
            return;
        }

        props.onDelete(props.attachment.id);
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
