export async function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string = 'image/png'): Promise<Blob> {
    return await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(blob => {
            if (blob) {
                resolve(blob);
            } else {
                reject();
            }
        }, mimeType);
    });
}
