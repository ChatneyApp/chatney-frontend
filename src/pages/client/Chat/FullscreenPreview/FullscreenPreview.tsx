import { useEffect, useRef } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { X } from 'lucide-react';

import { Attachment } from '@/types/attachments';

import styles from './FullscreenPreview.module.css';

type Props = {
    attachmentType: Attachment['type'];
    attachmentUrl: string;
    fileName: string;
    onClose(): void;
};

export const FullscreenPreview = ({
    attachmentType,
    attachmentUrl,
    fileName,
    onClose,
}: Props) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        const onKeyDown = (event: globalThis.KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    useEffect(() => {
        if (attachmentType === 'video') {
            videoRef.current?.focus();
        }
    }, [attachmentType]);

    const handleVideoKeyDown = (event: ReactKeyboardEvent<HTMLVideoElement>) => {
        const video = event.currentTarget;

        if (event.key.toLowerCase() === 'f') {
            event.preventDefault();
            if (document.fullscreenElement === video) {
                void document.exitFullscreen();
            } else {
                void video.requestFullscreen();
            }
        }
    };

    return (
        <div className={styles.previewOverlay} onClick={onClose}>
            <button className={styles.previewClose} type="button" onClick={onClose} aria-label="Close preview">
                <X size={22} />
            </button>
            {attachmentType === 'video'
                ? (
                    <video
                        ref={videoRef}
                        className={styles.previewVideo}
                        src={attachmentUrl}
                        controls
                        autoPlay
                        tabIndex={0}
                        onKeyDown={handleVideoKeyDown}
                        onClick={(event) => event.stopPropagation()}
                    />
                )
                : (
                    <img
                        className={styles.previewImage}
                        src={attachmentUrl}
                        alt={fileName}
                        onClick={(event) => event.stopPropagation()}
                    />
                )}
        </div>
    );
};
