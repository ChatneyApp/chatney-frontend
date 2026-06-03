import { getAttachmentType, getFileIcon } from '@/helpers/attachments/attachmentDisplay';
import { Attachment } from '@/types/attachments';

import styles from './MessageAttachmentComponent.module.css';

type Props = {
    attachment: Attachment;
}

const getAttachmentUrl = (attachment: Attachment) => `http://localhost:9000/chatney/${attachment.urlPath}`;

const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export const MessageAttachmentComponent = ({ attachment }: Props) => {
    const attachmentUrl = getAttachmentUrl(attachment);
    const attachmentType = attachment.asFile ? 'binary' : attachment.type;
    const contentAttachmentType = attachment.type === 'binary'
        ? getAttachmentType(attachment.mimeType)
        : attachment.type;
    const mediaSize = attachment.width && attachment.height
        ? { width: attachment.width, height: attachment.height }
        : {};

    switch (attachmentType) {
        case 'image':
        case 'gif':
            return (
                <img
                    className={styles.image}
                    src={attachmentUrl}
                    alt={attachment.originalFileName}
                    {...mediaSize}
                />
            );
        case 'video':
            return (
                <video
                    className={styles.video}
                    src={attachmentUrl}
                    controls
                    {...mediaSize}
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
                <a className={styles.binary} href={attachmentUrl} download={attachment.originalFileName}>
                    {getFileIcon(contentAttachmentType, { className: styles.binaryIcon, size: 18 })}
                    <span className={styles.binaryName}>{attachment.originalFileName}</span>
                    <span className={styles.binarySize}>{formatFileSize(attachment.size)}</span>
                </a>
            );
    }
}
