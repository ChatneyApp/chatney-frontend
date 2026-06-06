import { FormEventHandler, useCallback, useEffect, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { Button } from '@/components/Button';
import { formatFileSize } from '@/helpers/utils';
import { useDropZone } from '@/hooks/useDropZone';
import { MessageEditorAttachment } from '@/pages/client/Chat/MessageEditorAttachment';
import { AttachmentId, Attachment } from '@/types/attachments';
import { MessageId } from '@/types/messages';

import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './MessageInput.module.css';

type EditingMessage = {
    id: MessageId;
    content: string;
    attachments: Attachment[];
};

type Props = {
    editingMessage?: EditingMessage | null;
    replyToPreview?: string | null;
    onSend(text: string, attachmentIds: AttachmentId[]): Promise<void>;
    onSaveEdit?(id: MessageId, text: string, attachmentIds: AttachmentId[]): Promise<void>;
    onCancelEdit?(): void;
    onClearReply?(): void;
}

type EditorAttachment = {
    kind: 'uploaded';
    attachment: Attachment;
} | {
    kind: 'pending';
    draftId: string;
    file: File;
    compress: boolean;
    asFile: boolean;
};

const canCompressFile = (file: File) => file.type.startsWith('video/') || file.type.startsWith('audio/');

const canUploadAsFile = (file: File) =>
    file.type.startsWith('image/') || file.type.startsWith('video/') || file.type.startsWith('audio/');

export function MessageInput({ editingMessage, replyToPreview, onSend, onSaveEdit, onCancelEdit, onClearReply }: Props) {
    const [isSending, setIsSending] = useState(false);
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<EditorAttachment[]>([]);
    const [pendingFile, setPendingFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [compressPendingFile, setCompressPendingFile] = useState(false);
    const [uploadPendingFileAsFile, setUploadPendingFileAsFile] = useState(false);

    const isEditing = editingMessage != null;

    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.content);
            setAttachments(editingMessage.attachments.map(attachment => ({
                kind: 'uploaded',
                attachment,
            })));
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

    const uploadedAttachments = attachments
        .filter((attachment): attachment is Extract<EditorAttachment, { kind: 'uploaded' }> => attachment.kind === 'uploaded')
        .map(({ attachment }) => attachment);
    const hasPendingAttachments = attachments.some(attachment => attachment.kind === 'pending');
    const canSend = text.trim().length > 0 || uploadedAttachments.length > 0;
    const canSubmit = canSend && !hasPendingAttachments;

    const openFilePreview = (file: File) => {
        setPendingFile(file);
        setCompressPendingFile(false);
        setUploadPendingFileAsFile(false);
    };

    const closeFilePreview = () => {
        setPendingFile(null);
    };

    const confirmPendingFile = () => {
        if (!pendingFile) {
            return;
        }

        const file = pendingFile;
        const shouldCompress = !uploadPendingFileAsFile && compressPendingFile && canCompressFile(file);
        const asFile = uploadPendingFileAsFile && canUploadAsFile(file);
        closeFilePreview();
        setAttachments(list => [
            ...list,
            {
                kind: 'pending',
                draftId: crypto.randomUUID(),
                file,
                compress: shouldCompress,
                asFile,
            },
        ]);
    };

    const { onClick: onFileSelectClick } = useDropZone({
        onDrop: openFilePreview,
    });

    const handleSend: FormEventHandler = async (e) => {
        e.preventDefault();
        if (isSending || !canSubmit) {
            return;
        }
        setIsSending(true);
        try {
            if (isEditing && onSaveEdit) {
                await onSaveEdit(editingMessage.id, text, uploadedAttachments.map(a => a.id));
            } else {
                await onSend(text, uploadedAttachments.map(a => a.id));
                setText('');
                setAttachments([]);
            }
        } catch (_e) {
            // TODO
        } finally {
            setIsSending(false);
        }
    };

    const handleDeleteAttachment = useCallback((attachmentId: AttachmentId) => {
        setAttachments(list => list.filter(att => att.kind !== 'uploaded' || att.attachment.id !== attachmentId));
    }, []);

    const handleDeleteDraftAttachment = useCallback((draftId: string) => {
        setAttachments(list => list.filter(att => att.kind !== 'pending' || att.draftId !== draftId));
    }, []);

    const handleDraftAttachmentUploaded = useCallback((draftId: string, uploadedAttachment: Attachment) => {
        setAttachments(list => list.map(att => {
            if (att.kind !== 'pending' || att.draftId !== draftId) {
                return att;
            }

            return {
                kind: 'uploaded',
                attachment: uploadedAttachment,
            };
        }));
    }, []);

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
                                {canUploadAsFile(pendingFile) && (
                                    <label className={styles.filePreviewOption}>
                                        <input
                                            type="checkbox"
                                            checked={uploadPendingFileAsFile}
                                            onChange={(e) => {
                                                setUploadPendingFileAsFile(e.target.checked);
                                                if (e.target.checked) {
                                                    setCompressPendingFile(false);
                                                }
                                            }}
                                        />
                                        <span>Send as file</span>
                                    </label>
                                )}
                                {canCompressFile(pendingFile) && (
                                    <label className={styles.filePreviewOption}>
                                        <input
                                            type="checkbox"
                                            checked={compressPendingFile}
                                            disabled={uploadPendingFileAsFile}
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
                        attachment.kind === 'uploaded'
                            ? (
                                <MessageEditorAttachment
                                    key={attachment.attachment.id}
                                    attachment={attachment.attachment}
                                    onDelete={handleDeleteAttachment}
                                />
                            )
                            : (
                                <MessageEditorAttachment
                                    key={attachment.draftId}
                                    draftId={attachment.draftId}
                                    file={attachment.file}
                                    compress={attachment.compress}
                                    asFile={attachment.asFile}
                                    onUploaded={handleDraftAttachmentUploaded}
                                    onDelete={handleDeleteDraftAttachment}
                                />
                            )
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
                    disabled={!canSubmit}
                    className={styles.sendButton}
                >
                    {isEditing ? 'Save' : 'Send'}
                </button>
            </form>
        </div>
    );
}
