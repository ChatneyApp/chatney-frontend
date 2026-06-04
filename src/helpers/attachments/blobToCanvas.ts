import { imageLoadPromise } from './imageLoadPromise';
import type { Size } from './types';

export async function blobToCanvas(blob: Blob, size?: Size): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = document.createElement('img');

    img.src = URL.createObjectURL(blob);
    await imageLoadPromise(img);
    URL.revokeObjectURL(img.src);

    canvas.width = size?.width ?? img.naturalWidth;
    canvas.height = size?.height ?? img.naturalHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return canvas;
}
