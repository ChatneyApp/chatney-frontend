import { blobToCanvas } from '@/helpers/attachments/blobToCanvas';
import { calculateFittingSize } from '@/helpers/attachments/calculateFittingSize';
import { canvasToBlob } from '@/helpers/attachments/canvasToBlob';
import { imageLoadPromise } from '@/helpers/attachments/imageLoadPromise';
import type { Size } from '@/helpers/attachments/types';

const TARGET_SIDE = 1024;
const JPEG_QUALITY = 0.84;

const SUPPORTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png']);

export const getSupportedImageMimeType = (file: File) => {
    if (SUPPORTED_IMAGE_TYPES.has(file.type)) {
        return file.type;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension === 'jpg' || extension === 'jpeg') {
        return 'image/jpeg';
    }

    if (extension === 'png') {
        return 'image/png';
    }

    return null;
};

export const canPrepareImage = (file: File) => getSupportedImageMimeType(file) != null;

const readImageSize = async (file: File): Promise<Size> => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);

    try {
        await imageLoadPromise(img);

        return {
            width: img.naturalWidth,
            height: img.naturalHeight,
        };
    } finally {
        URL.revokeObjectURL(img.src);
    }
};

export const prepareImage = async (file: File): Promise<Blob> => {
    const mimeType = getSupportedImageMimeType(file);
    if (!mimeType) {
        return file;
    }

    const originalSize = await readImageSize(file);
    const fittingSize = calculateFittingSize(originalSize, TARGET_SIDE);
    if (fittingSize.width === originalSize.width && fittingSize.height === originalSize.height) {
        return file;
    }

    const canvas = await blobToCanvas(file, fittingSize);

    return await canvasToBlob(
        canvas,
        mimeType,
        mimeType === 'image/jpeg' ? JPEG_QUALITY : undefined,
    );
};
