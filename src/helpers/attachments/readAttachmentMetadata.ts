import { getAttachmentType } from '@/helpers/attachments/attachmentDisplay';
import { AttachmentUploadMetadata } from '@/types/attachments';

const readImageSize = (url: string): Promise<AttachmentUploadMetadata> => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve({
        width: image.naturalWidth,
        height: image.naturalHeight,
    });
    image.onerror = () => reject(new Error('Failed to read image size'));
    image.src = url;
});

const readMediaMetadata = (url: string, mediaType: 'audio' | 'video'): Promise<AttachmentUploadMetadata> => new Promise((resolve, reject) => {
    const media = document.createElement(mediaType);
    media.preload = 'metadata';
    media.onloadedmetadata = () => {
        if (mediaType === 'audio') {
            const duration = Number.isFinite(media.duration) ? Math.round(media.duration) : undefined;
            resolve({ duration });
            return;
        }

        const video = media as HTMLVideoElement;
        resolve({
            width: video.videoWidth,
            height: video.videoHeight,
        });
    };
    media.onerror = () => reject(new Error(`Failed to read ${mediaType} metadata`));
    media.src = url;
});

export const readAttachmentMetadata = async (
    blob: Blob,
    mimeType: string,
    asFile: boolean,
): Promise<AttachmentUploadMetadata | undefined> => {
    if (asFile) {
        return undefined;
    }

    const attachmentType = getAttachmentType(mimeType);
    if (attachmentType === 'binary') {
        return undefined;
    }

    const url = URL.createObjectURL(blob);
    try {
        if (attachmentType === 'image' || attachmentType === 'gif') {
            return await readImageSize(url);
        }

        if (attachmentType === 'video') {
            return await readMediaMetadata(url, 'video');
        }

        if (attachmentType === 'audio') {
            return await readMediaMetadata(url, 'audio');
        }
    } finally {
        URL.revokeObjectURL(url);
    }

    return undefined;
};
