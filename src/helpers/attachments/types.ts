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
