import { AttachmentId, UploadedAttachment } from '@/types/attachments';

import styles from './MessageEditorAttachment.module.css';

type Props = {
    attachment: UploadedAttachment;
    onDelete(attachmentId: AttachmentId): void;
}
export const MessageEditorAttachment = ({ attachment, onDelete }: Props) => (
    <div className={styles.container} style={{
        backgroundImage: `url("${attachment.s3Url}")`
    }}>
        <button className={styles.deleteButton} onClick={() => onDelete(attachment.attachmentId)}>
            X
        </button>
    </div>
);
