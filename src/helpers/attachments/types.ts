export interface VideoProperties {
    fps: number;
    width: number;
    height: number;
}

export interface ProgressEvent {
    progress: number;
    time: number;
}

export type FFmpegExecResult = Record<string, string>;

export interface Size {
    width: number;
    height: number;
}

export type AudioConfig = {
    audioFrequency?: string;
    audioTargetBitrate?: string;
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
