// [libx264 @ 0xe00510] Possible presets: ultrafast superfast veryfast faster fast medium slow slower veryslow placebo
export enum Libx264VideoCompressionPreset {
    ultrafast = 'ultrafast',
    superfast = 'superfast',
    veryfast = 'veryfast',
    faster = 'faster',
    fast = 'fast',
    medium = 'medium',
    slow = 'slow',
    slower = 'slower',
    veryslow = 'veryslow',
    placebo = 'placebo',
}

export type AudioConfig = {
    audio_frequency?: string;
    audio_target_bitrate?: string;
}

export type VideoConfig = {
    audioFrequency?: string;
    audioTargetBitrate?: string;
    videoBufferSize?: string;
    videoMinRate?: string;
    videoMaxRate?: string;
    videoH264Preset?: string;
    videoFramerate?: string;
}

export const NORMALIZED_VIDEO_SIZE = { width: 576, height: 1024 };
export const NORMALIZED_VIDEO_BG_COLOR = 'black';

export const compileFfmpegAudioParams = (videoConfig: AudioConfig): string[] => {
    const audioFrequency = videoConfig?.audio_frequency ?? '44100';
    const audioTargetBitrate = videoConfig?.audio_target_bitrate ?? '128k';

    return [
        '-err_detect', 'explode',
        '-xerror',
        '-c:a', 'mp3',
        '-b:a', audioTargetBitrate,
        '-ar', audioFrequency,
    ];
};

export const compileFfmpegVideoParams = (videoConfig: VideoConfig): string[] => {
    const audioFrequency = videoConfig?.audioFrequency ?? '44100';
    const audioTargetBitrate = videoConfig?.audioTargetBitrate ?? '128k';
    const videoBufferSize = videoConfig?.videoBufferSize;
    const videoMinBitrate = videoConfig?.videoMinRate;
    const videoMaxBitrate = videoConfig?.videoMaxRate;
    const videoH264Preset = videoConfig?.videoH264Preset ?? Libx264VideoCompressionPreset.ultrafast;
    const videoFrameRate = videoConfig?.videoFramerate ?? '30';

    return [
        '-err_detect', 'explode',
        '-xerror',
        '-c:v', 'libx264',
        '-profile:v', 'high',
        '-level:v', '4.0',
        '-pix_fmt', 'yuv420p',
        '-colorspace:v', 'bt709',
        '-color_primaries:v', 'bt709',
        '-color_trc:v', 'bt709',
        '-color_range:v', 'tv',
        '-bsf:v', 'h264_metadata=chroma_sample_loc_type=0',
        '-c:a', 'aac',
        '-b:a', audioTargetBitrate,
        '-ar', audioFrequency,
        '-x264opts', 'opencl', // slight boost
        '-brand', 'mp42', // brand compat
        '-preset', `${videoH264Preset}`, // compression preset
        '-movflags', '+faststart', // ability to start video earlier (streaming?)
        ...(typeof videoMinBitrate === 'string' ? ['-minrate', videoMinBitrate] : []),
        ...(typeof videoMaxBitrate === 'string' ? ['-maxrate', videoMaxBitrate] : []),
        ...(typeof videoBufferSize === 'string' ? ['-bufsize', videoBufferSize] : []),
        '-r', videoFrameRate,
    ];
};
