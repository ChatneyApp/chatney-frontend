import { UrlPreview } from '@/types/messages';

import styles from './MessageUrlPreviewComponent.module.css';

type Props = {
    preview: UrlPreview;
}
export const MessageUrlPreviewComponent = ({ preview }: Props) => {
    const { title, description, imageUrl, url, siteName, mediaSize } = preview;

    if (!title && !description && !imageUrl) {
        return null;
    }

    const imageWidth = mediaSize?.width;
    const imageHeight = mediaSize?.height;
    const imageAspectRatio = typeof imageWidth === 'number' && typeof imageHeight === 'number' && imageHeight > 0
        ? `${imageWidth} / ${imageHeight}` : undefined;

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
            {imageUrl && (
                <img
                    src={imageUrl}
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
