import { imageLoadPromise } from './imageLoadPromise';

export async function blobToCanvas(blob: Blob): Promise<HTMLCanvasElement> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = document.createElement('img');

    img.src = URL.createObjectURL(blob);
    await imageLoadPromise(img);
    URL.revokeObjectURL(img.src);

    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    return canvas;
}
