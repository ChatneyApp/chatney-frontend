import { Attachment } from '@/types/attachments';
import { MessageAttachmentComponent } from '@/pages/client/Chat/MessageAttachmentComponent';

import styles from './MessageAttachments.module.css';

type Props = {
    attachments: Attachment[];
}

export const MessageAttachments = ({ attachments }: Props) => {
    if (attachments.length === 0) {
        return null;
    }

    return (
        <div className={styles.container}>
            {attachments.map(attachment => (
                <MessageAttachmentComponent
                    key={attachment.id}
                    attachment={attachment}
                />
            ))}
        </div>
    );
}
