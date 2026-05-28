import { convertVideo } from '@/helpers/attachments/ffmpeg';
import type { VideoConfig } from '@/helpers/attachments/ffmpeg/config';

export const prepareVideo = async (file: File, abortController: AbortController): Promise<Blob> => {
    const videoConfig: VideoConfig = {
        // TODO: optimize later
    };
    const _convertedVideo = await convertVideo(file, videoConfig, (progress) => {
        // setVideoConversionProgress(Math.floor(progress * 100));
        console.log(`video conversion progress: ${Math.floor(progress * 100)}%`)
    }, abortController.signal);

    return _convertedVideo;
}
