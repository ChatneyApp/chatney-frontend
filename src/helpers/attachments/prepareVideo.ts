import { convertVideo } from '@/helpers/attachments/ffmpeg';
import type { VideoConfig } from '@/helpers/attachments/ffmpeg/config';

export const prepareVideo = async (
    file: File,
    abortController: AbortController,
    onProgress?: (progress: number) => void,
): Promise<Blob> => {
    const videoConfig: VideoConfig = {
        // TODO: optimize later
    };
    const convertedVideo = await convertVideo(file, videoConfig, (progress) => {
        onProgress?.(progress);
        console.log(`video conversion progress: ${Math.floor(progress * 100)}%`);
    }, abortController.signal);

    return convertedVideo;
};
