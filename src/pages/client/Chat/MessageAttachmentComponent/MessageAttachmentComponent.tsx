import { useState } from 'react';

import { getAttachmentType, getFileIcon } from '@/helpers/attachments/attachmentDisplay';
import { formatFileSize } from '@/helpers/utils';
import { AudioAttachment } from '@/pages/client/Chat/AudioAttachment';
import { FullscreenPreview } from '@/pages/client/Chat/FullscreenPreview';
import { Attachment } from '@/types/attachments';

import styles from './MessageAttachmentComponent.module.css';

type Props = {
    attachment: Attachment;
}

const getAttachmentUrl = (attachment: Attachment) => `http://localhost:9000/chatney/${attachment.urlPath}`;

export const MessageAttachmentComponent = ({ attachment }: Props) => {
    const [previewOpen, setPreviewOpen] = useState(false);
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
                <>
                    <button className={styles.mediaButton} type="button" onClick={() => setPreviewOpen(true)}>
                        <img
                            className={styles.image}
                            src={attachmentUrl}
                            alt={attachment.originalFileName}
                            {...mediaSize}
                        />
                    </button>
                    {previewOpen && (
                        <FullscreenPreview
                            attachmentType={attachmentType}
                            attachmentUrl={attachmentUrl}
                            fileName={attachment.originalFileName}
                            onClose={() => setPreviewOpen(false)}
                        />
                    )}
                </>
            );
        case 'video':
            return (
                <>
                    <button className={styles.mediaButton} type="button" onClick={() => setPreviewOpen(true)}>
                        <video
                            className={styles.video}
                            src={attachmentUrl}
                            muted
                            playsInline
                            preload="metadata"
                            {...mediaSize}
                        />
                    </button>
                    {previewOpen && (
                        <FullscreenPreview
                            attachmentType={attachmentType}
                            attachmentUrl={attachmentUrl}
                            fileName={attachment.originalFileName}
                            onClose={() => setPreviewOpen(false)}
                        />
                    )}
                </>
            );
        case 'audio':
            return <AudioAttachment attachment={attachment} attachmentUrl={attachmentUrl} />;
        case 'binary':
            return (
                <a
                    className={styles.binary}
                    href={attachmentUrl}
                    download={attachment.originalFileName}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <span className={styles.binaryIconTile}>
                        {getFileIcon(contentAttachmentType, { className: styles.binaryIcon, size: 20 })}
                    </span>
                    <span className={styles.binaryInfo}>
                        <span className={styles.binaryName}>{attachment.originalFileName}</span>
                        <span className={styles.binarySize}>
                            {formatFileSize(attachment.size)}
                            {attachment.originalFileName.includes('.') && (
                                <> • {attachment.originalFileName.split('.').pop()?.toUpperCase()}</>
                            )}
                        </span>
                    </span>
                </a>
            );
    }
}
