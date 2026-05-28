import { Attachment } from '@/types/attachments';

import styles from './MessageAttachmentComponent.module.css';

type Props = {
    attachment: Attachment;
}

const getAttachmentUrl = (attachment: Attachment) => `http://localhost:9000/chatney/${attachment.urlPath}`;

export const MessageAttachmentComponent = ({ attachment }: Props) => {
    const attachmentUrl = getAttachmentUrl(attachment);

    switch (attachment.type) {
        case 'image':
        case 'gif':
            return (
                <img
                    className={styles.image}
                    src={attachmentUrl}
                    alt={attachment.originalFileName}
                />
            );
        case 'video':
            return (
                <video
                    className={styles.video}
                    src={attachmentUrl}
                    controls
                />
            );
        case 'audio':
            return (
                <audio
                    className={styles.audio}
                    src={attachmentUrl}
                    controls
                />
            );
        case 'binary':
            return (
                <span className={styles.binary}>
                    {attachment.originalFileName}
                </span>
            );
    }
}
