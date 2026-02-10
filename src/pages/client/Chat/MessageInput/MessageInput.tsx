import { FormEventHandler, useState } from 'react';
import { Paperclip } from 'lucide-react';

import { useDropZone } from '@/hooks/useDropZone';

import styles from './MessageInput.module.css';
import { FileAttachmentId } from '@/types/messages.ts';

type Props = {
    onSend(text: string, attachmentIds: FileAttachmentId[]): Promise<void>;
}
export function MessageInput({ onSend }: Props) {
    const [isSending, setIsSending] = useState(false);
    const [text, setText] = useState('');
    const [attachmentIds, setAttachmentIds] = useState<FileAttachmentId[]>([]);

    const canSend = text.trim().length > 0;

    const handleDrop = async (file: File) => {
        console.log('Dropped file', file);
        // TODO: preprocess the file
        // TODO: upload it as a temprorary attachment and get an attachment ID to send with the message
        // const attachment = await fileUpload(file);
        const attachmentId = crypto.randomUUID();
        setAttachmentIds(v => [...v, attachmentId]);
    };

    const { onClick: onFileSelectClick } = useDropZone({ onDrop: handleDrop });

    const handleSend: FormEventHandler = async (e) => {
        e.preventDefault();
        if (isSending || !canSend) {
            return;
        }
        setIsSending(true);
        try {
            await onSend(text, attachmentIds);
            setText('');
        } catch (_e) {
            // TODO
        }
    };

    return (
        <form
            onSubmit={handleSend}
            className="w-full border-t border-gray-700 p-3 flex items-center bg-gray-800 message-input"
        >
            <div className={styles.fileDropArea}>
                <Paperclip className={styles.fileAttachmentIcon} onClick={onFileSelectClick} />
            </div>
            <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                type="submit"
                disabled={!canSend}
                className={styles.sendButton}
            >
                Send
            </button>
        </form>
    );
}
