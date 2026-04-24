import { FormEventHandler, useEffect, useState } from 'react';
import { Paperclip, X } from 'lucide-react';
import { useApolloClient } from '@apollo/client/react';

import { useDropZone } from '@/hooks/useDropZone';
import { prepareImage } from '@/helpers/attachments/prepareImage';
import { uploadFile } from '@/graphql/attachments';
import { MessageEditorAttachment } from '@/pages/client/Chat/MessageEditorAttachment';
import { AttachmentId, UploadedAttachment } from '@/types/attachments';
import { MessageId } from '@/types/messages';

import styles from './MessageInput.module.css';

type EditingMessage = {
    id: MessageId;
    content: string;
    attachments: UploadedAttachment[];
};

type Props = {
    onSend(text: string, attachmentIds: AttachmentId[]): Promise<void>;
    onSaveEdit?(id: MessageId, text: string, attachmentIds: AttachmentId[]): Promise<void>;
    onCancelEdit?(): void;
    editingMessage?: EditingMessage | null;
    replyToPreview?: string | null;
    onClearReply?(): void;
}
export function MessageInput({ onSend, onSaveEdit, onCancelEdit, editingMessage, replyToPreview, onClearReply }: Props) {
    const apolloClient = useApolloClient();
    const [isSending, setIsSending] = useState(false);
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState<UploadedAttachment[]>([]);

    const isEditing = editingMessage != null;

    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.content);
            setAttachments(editingMessage.attachments);
        } else {
            setText('');
            setAttachments([]);
        }
    }, [editingMessage?.id]);

    const canSend = text.trim().length > 0 || attachments.length > 0;

    const handleDrop = async (file: File) => {
        const { name, lastModified, type } = file;
        console.log('Dropped file', name, lastModified, type);
        const isImage = file.type.startsWith('image/');
        const isGif = file.type === 'image/gif';
        const shouldProcessFile = isImage && !isGif;
        const preprocessedBlob = shouldProcessFile
            ? await prepareImage(file)
            : file;
        const fileName = file.name;
        const mimeType = shouldProcessFile ? 'image/jpeg' : file.type;

        try {
            const { attachmentId, s3Url } = await uploadFile(apolloClient, preprocessedBlob, fileName, mimeType);
            console.log('Got response', { attachmentId, s3Url });
            setAttachments(v => [...v, { attachmentId, s3Url }]);
        } catch (err) {
            console.error('Error during file upload', err);
        }
    };

    const { onClick: onFileSelectClick } = useDropZone({ onDrop: handleDrop });

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

    return (
        <div className={styles.container}>
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
