import { UrlPreview } from '@/types/messages';

import styles from './MessageUrlPreviewComponent.module.css';

type Props = {
    preview: UrlPreview;
}
export const MessageUrlPreviewComponent = ({ preview }: Props) => {
    const { title, description, thumbnailUrl, url, siteName, thumbnailWidth, thumbnailHeight } = preview;

    if (!title && !description && !thumbnailUrl) {
        return null;
    }

    const imageAspectRatio = typeof thumbnailWidth === 'number' && typeof thumbnailHeight === 'number' && thumbnailHeight > 0
        ? `${thumbnailWidth} / ${thumbnailHeight}` : undefined;

    return (
        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.container}>
            {siteName && (
                <div className={styles.siteName}>{siteName}</div>
            )}
            {title && (
                <div className={styles.title}>{title}</div>
            )}
            {description && (
                <div className={styles.description}>{description}</div>
            )}
            {thumbnailUrl && (
                <img
                    src={thumbnailUrl}
                    alt={title ?? undefined}
                    className={styles.image}
                    style={{
                        aspectRatio: imageAspectRatio
                    }}
                />
            )}
        </a>
    );
}
