import { FormEventHandler, useState } from 'react';
import { Paperclip } from 'lucide-react';
import { useApolloClient } from '@apollo/client/react';

import { useDropZone } from '@/hooks/useDropZone';
import { FileAttachmentId } from '@/types/messages';
import { prepareImage } from '@/helpers/attachments/prepareImage';
import { uploadFile } from '@/graphql/attachments';

import styles from './MessageInput.module.css';

type Props = {
    onSend(text: string, attachmentIds: FileAttachmentId[]): Promise<void>;
}
export function MessageInput({ onSend }: Props) {
    const apolloClient = useApolloClient();
    const [isSending, setIsSending] = useState(false);
    const [text, setText] = useState('');
    const [attachmentIds, setAttachmentIds] = useState<FileAttachmentId[]>([]);

    const canSend = text.trim().length > 0;

    const handleDrop = async (file: File) => {
        const { name, lastModified, type } = file;
        console.log('Dropped file', name, lastModified, type);
        // preprocess the file
        const isImage = file.type.startsWith('image/');
        const isGif = file.type === 'image/gif';
        const preprocessedBlob = isImage && !isGif
            ? await prepareImage(file)
            : file;
        console.log('preprocessed data length', preprocessedBlob.size);

        const response = await uploadFile(apolloClient, preprocessedBlob, 'myfile.jpg', 'image/jpeg');
        console.log('Got response', response);
        setAttachmentIds(v => [...v, response.attachmentId]);
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
        } finally {
            setIsSending(false);
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
