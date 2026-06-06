// [libx264 @ 0xe00510] Possible presets: ultrafast superfast veryfast faster fast medium slow slower veryslow placebo
import { AudioConfig, VideoConfig } from '@/helpers/attachments/types';

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

const DEFAULT_AUDIO_FREQUENCY = '44100';
const DEFAULT_AUDIO_BITRATE = '128k';
const DEFAULT_FRAMERATE = '30';

const strictFailureParams = ['-err_detect', 'explode', '-xerror'];

const pair = (name: string, value: string) => [name, value];

function compileAudioCodec(codec: 'aac' | 'mp3', config: AudioConfig, includeStrictMode = true): string[] {
    const bitrate = config.audioTargetBitrate ?? DEFAULT_AUDIO_BITRATE;
    const frequency = config.audioFrequency ?? DEFAULT_AUDIO_FREQUENCY;

    return [
        ...(includeStrictMode ? strictFailureParams : []),
        ...pair('-c:a', codec),
        ...pair('-b:a', bitrate),
        ...pair('-ar', frequency),
    ];
}

function appendIfString(args: string[], option: string, value?: string) {
    if (typeof value === 'string') {
        args.push(option, value);
    }
}

export function compileFfmpegAudioParams(audioConfig: AudioConfig): string[] {
    return compileAudioCodec('mp3', audioConfig);
}

export function compileFfmpegVideoParams(videoConfig: VideoConfig): string[] {
    const preset = videoConfig.videoH264Preset ?? Libx264VideoCompressionPreset.ultrafast;
    const frameRate = videoConfig.videoFramerate ?? DEFAULT_FRAMERATE;

    const params = [
        ...strictFailureParams,
        ...pair('-c:v', 'libx264'),
        ...pair('-profile:v', 'high'),
        ...pair('-level:v', '4.0'),
        ...pair('-pix_fmt', 'yuv420p'),
        ...pair('-colorspace:v', 'bt709'),
        ...pair('-color_primaries:v', 'bt709'),
        ...pair('-color_trc:v', 'bt709'),
        ...pair('-color_range:v', 'tv'),
        ...pair('-bsf:v', 'h264_metadata=chroma_sample_loc_type=0'),
        ...compileAudioCodec('aac', videoConfig, false),
        ...pair('-x264opts', 'opencl'),
        ...pair('-brand', 'mp42'),
        ...pair('-preset', preset),
        ...pair('-movflags', '+faststart'),
    ];

    appendIfString(params, '-minrate', videoConfig.videoMinRate);
    appendIfString(params, '-maxrate', videoConfig.videoMaxRate);
    appendIfString(params, '-bufsize', videoConfig.videoBufferSize);

    return [...params, ...pair('-r', frameRate)];
}
