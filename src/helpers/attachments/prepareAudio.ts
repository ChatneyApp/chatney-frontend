import { convertAudio } from '@/helpers/attachments/ffmpeg';
import type { AudioConfig } from '@/helpers/attachments/ffmpeg/config';

export const prepareAudio = async (file: File, abortController: AbortController): Promise<Blob> => {
    const audioConfig: AudioConfig = {
        // TODO: optimize later
    };
    const _convertedAudio = await convertAudio(file, audioConfig, (progress) => {
        // setVideoConversionProgress(Math.floor(progress * 100));
        console.log(`audio conversion progress: ${Math.floor(progress * 100)}%`)
    }, abortController.signal);

    return _convertedAudio;
}
