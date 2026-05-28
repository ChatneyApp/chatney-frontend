import { convertAudio } from '@/helpers/attachments/ffmpeg';
import type { AudioConfig } from '@/helpers/attachments/ffmpeg/config';

export const prepareAudio = async (
    file: File,
    abortController: AbortController,
    onProgress?: (progress: number) => void,
): Promise<Blob> => {
    const audioConfig: AudioConfig = {
        // TODO: optimize later
    };
    const convertedAudio = await convertAudio(file, audioConfig, (progress) => {
        onProgress?.(progress);
        console.log(`audio conversion progress: ${Math.floor(progress * 100)}%`);
    }, abortController.signal);

    return convertedAudio;
};
