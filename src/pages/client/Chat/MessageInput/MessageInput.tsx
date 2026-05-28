import { FormEventHandler, useEffect, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { Dialog } from 'radix-ui';
import { useApolloClient } from '@apollo/client/react';

import { useDropZone } from '@/hooks/useDropZone';
import { uploadFile } from '@/graphql/attachments';
import { MessageEditorAttachment } from '@/pages/client/Chat/MessageEditorAttachment';
import { AttachmentId, UploadedAttachment } from '@/types/attachments';
import { MessageId } from '@/types/messages';
import { Button } from '@/components/Button';
import { prepareVideo } from '@/helpers/attachments/prepareVideo';
import { prepareAudio } from '@/helpers/attachments/prepareAudio';

import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './MessageInput.module.css';

type EditingMessage = {
    id: MessageId;
    content: string;
    attachments: UploadedAttachment[];
};

type Props = {
    editingMessage?: EditingMessage | null;
    replyToPreview?: string | null;
    onSend(text: string, attachmentIds: AttachmentId[]): Promise<void>;
    onSaveEdit?(id: MessageId, text: string, attachmentIds: AttachmentId[]): Promise<void>;
    onCancelEdit?(): void;
    onClearReply?(): void;
}

const allowedAttachmentExtensions = {
    image: ['jpg', 'jpeg', 'png', 'bmp', 'webp', 'avif'],
    gif: ['gif'],
    video: ['mp4', 'mpg', 'mov', 'avi', 'mkv', 'webm'],
    audio: ['mp3', 'wav', 'ogg', 'm4a', 'aiff', 'flac', 'wma', 'aac'],
    binary: [],
};

const buildFileMask = (extensionsByType: Record<string, string[]>) => Object.values(extensionsByType)
    .flat()
    .map(extension => `.${extension}`)
    .join(',');

const canCompressFile = (file: File) => file.type.startsWith('video/') || file.type.startsWith('audio/');

const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export function MessageInput({ editingMessage, replyToPreview, onSend, onSaveEdit, onCancelEdit, onClearReply }: Props) {
    const apolloClient = useApolloClient();
    const [isSending, setIsSending] = useState(false);
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [compressPendingFile, setCompressPendingFile] = useState(false);

    const isEditing = editingMessage != null;

    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.content);
            setAttachments(editingMessage.attachments);
        } else {
            setText('');
            setAttachments([]);
        }
    }, [editingMessage]);

    useEffect(() => {
        if (!pendingFile) {
            setPreviewUrl(null);
            return;
        }

        const url = URL.createObjectURL(pendingFile);
        setPreviewUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [pendingFile]);

    const canSend = text.trim().length > 0 || attachments.length > 0;

    const handleDrop = async (file: File, options: { compress: boolean }) => {
        const { name, lastModified, type } = file;
        console.log('Dropped file', name, lastModified, type);
        const isVideo = file.type.startsWith('video/');
        const isAudio = file.type.startsWith('audio/');
        const shouldProcessFile = options.compress && (isVideo || isAudio);
        let preprocessedBlob: Blob = file;
        if (shouldProcessFile) {
            // TODO: make video conversion abortable
            const abortController = new AbortController();
            if (isAudio) {
                preprocessedBlob = await prepareAudio(file, abortController);
            } else if (isVideo) {
                preprocessedBlob = await prepareVideo(file, abortController);
            }
        }
        const fileName = file.name;
        let mimeType =  file.type;
        if (shouldProcessFile) {
            if (isAudio) {
                mimeType = 'audio/mpeg';
            } else if (isVideo) {
                mimeType = 'video/mp4';
            }
        }

        try {
            const { attachmentId, s3Url, mimeType: serverMimeType, size } = await uploadFile(apolloClient, preprocessedBlob, fileName, mimeType);
            console.log('Got response', { attachmentId, s3Url });
            setAttachments(v => [...v, { attachmentId, s3Url, mimeType: serverMimeType, size }]);
        } catch (err) {
            console.error('Error during file upload', err);
        }
    };

    const openFilePreview = (file: File) => {
        setPendingFile(file);
        setCompressPendingFile(false);
    };

    const closeFilePreview = () => {
        setPendingFile(null);
    };

    const confirmPendingFile = () => {
        if (!pendingFile) {
            return;
        }

        const file = pendingFile;
        const shouldCompress = compressPendingFile && canCompressFile(file);
        closeFilePreview();
        void handleDrop(file, { compress: shouldCompress });
    };

    const { onClick: onFileSelectClick } = useDropZone({
        fileMask: buildFileMask(allowedAttachmentExtensions),
        onDrop: openFilePreview,
    });

    const handleSend: FormEventHandler = async (e) => {
        e.preventDefault();
        if (isSending || !canSend) {
            return;
        }
        setIsSending(true);
        try {
            if (isEditing && onSaveEdit) {
                await onSaveEdit(editingMessage.id, text, attachments.map(a => a.attachmentId));
            } else {
                await onSend(text, attachments.map(a => a.attachmentId));
                setText('');
                setAttachments([]);
            }
        } catch (_e) {
            // TODO
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteAttachment = (attachmentId: AttachmentId) => {
        setAttachments(list => list.filter(att => att.attachmentId !== attachmentId));
    };

    const renderPendingFilePreview = () => {
        if (!pendingFile || !previewUrl) {
            return null;
        }

        const mimeType = pendingFile.type;
        if (mimeType.startsWith('image/')) {
            return <img className={styles.filePreviewImage} src={previewUrl} alt={pendingFile.name} />;
        }

        if (mimeType.startsWith('video/')) {
            return <video className={styles.filePreviewMedia} src={previewUrl} controls />;
        }

        if (mimeType.startsWith('audio/')) {
            return <audio className={styles.filePreviewAudio} src={previewUrl} controls />;
        }

        if (mimeType === 'application/pdf') {
            return <iframe className={styles.filePreviewFrame} src={previewUrl} title={pendingFile.name} />;
        }

        return (
            <div className={styles.filePreviewFallback}>
                <span className={styles.filePreviewFallbackIcon}>FILE</span>
                <span>{mimeType || 'Unknown file type'}</span>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <Dialog.Root open={pendingFile != null} onOpenChange={(open) => !open && closeFilePreview()}>
                <Dialog.Portal>
                    <Dialog.Overlay className={dialogStyles.overlay}/>
                    <Dialog.Content className={dialogStyles.container}>
                        <Dialog.Title className={dialogStyles.title}>Send file</Dialog.Title>
                        {pendingFile && (
                            <div className={styles.filePreviewDialog}>
                                <div className={styles.filePreviewArea}>
                                    {renderPendingFilePreview()}
                                </div>
                                <div className={styles.filePreviewMeta}>
                                    <span className={styles.filePreviewName}>{pendingFile.name}</span>
                                    <span className={styles.filePreviewDetails}>
                                        {pendingFile.type || 'Unknown MIME type'} - {formatFileSize(pendingFile.size)}
                                    </span>
                                </div>
                                {canCompressFile(pendingFile) && (
                                    <label className={styles.filePreviewCompress}>
                                        <input
                                            type="checkbox"
                                            checked={compressPendingFile}
                                            onChange={(e) => setCompressPendingFile(e.target.checked)}
                                        />
                                        <span>Compress</span>
                                    </label>
                                )}
                            </div>
                        )}
                        <div className={dialogStyles.bottomButtons}>
                            <Button type="button" onClick={closeFilePreview}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={confirmPendingFile}>
                                Send
                            </Button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            {isEditing && (
                <div className={styles.editBanner}>
                    <span>Editing message</span>
                    <X className={styles.replyPreviewClear} onClick={onCancelEdit} />
                </div>
            )}
            {!isEditing && replyToPreview && (
                <div className={styles.replyPreview}>
                    <span className={styles.replyPreviewText}>
                        {replyToPreview.length > 50 ? replyToPreview.slice(0, 50) + '…' : replyToPreview}
                    </span>
                    <X className={styles.replyPreviewClear} onClick={onClearReply} />
                </div>
            )}
            {attachments.length > 0 && (
                <div className={styles.attachmentsList}>
                    {attachments.map(attachment => (
                        <MessageEditorAttachment
                            key={attachment.attachmentId}
                            attachment={attachment}
                            onDelete={handleDeleteAttachment}
                        />
                    ))}
                </div>
            )}
            <form onSubmit={handleSend} className={styles.sendForm}>
                <div className={styles.fileDropArea}>
                    <Paperclip className={styles.fileAttachmentIcon} onClick={onFileSelectClick} />
                </div>
                <input
                    type="text"
                    placeholder={isEditing ? 'Edit message…' : 'Type a message...'}
                    className="flex-1 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={!canSend}
                    className={styles.sendButton}
                >
                    {isEditing ? 'Save' : 'Send'}
                </button>
            </form>
        </div>
    );
}
