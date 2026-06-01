import { blobToCanvas } from '@/helpers/attachments/blobToCanvas';

export const prepareImage = async (file: File): Promise<Blob> => {
    const canvas = await blobToCanvas(file);
    return new Promise(resolve => {
        canvas.toBlob(b => {
            resolve(b!);
        }, 'image/jpeg', 0.8);
    });
}
