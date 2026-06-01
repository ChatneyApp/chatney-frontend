import { FFmpeg } from '@ffmpeg/ffmpeg';

import { FFmpegExecResult, ProgressEvent, VideoProperties } from '@/helpers/attachments/ffmpeg/types';

export async function ffmpegExec(
    ffmpeg: FFmpeg,
    args: string[],
    progressCallback?: (e: ProgressEvent) => void,
    signal?: AbortSignal,
): Promise<FFmpegExecResult> {
    const logs: Record<string, string[]> = {};

    ffmpeg.on('log', ({ message, type }) => {
        if (!logs[type]) {
            logs[type] = [];
        }
        logs[type].push(message);
    });
    if (progressCallback) {
        ffmpeg.on('progress', progressCallback);
    }
    try {
        await ffmpeg.exec(args, undefined, { signal });
    } catch (e) {
        console.error('ffmpegExec err', e);
    }
    if (progressCallback) {
        ffmpeg.off('progress', progressCallback);
    }
    return Object.fromEntries(
        Object.entries(logs)
            .map(([k, v]) => [k, v.join('\n')]),
    );
}

export async function getVideoProperties(ffmpeg: FFmpeg, fileName: string): Promise<VideoProperties> {
    const result: VideoProperties = {
        fps: 0,
        width: 0,
        height: 0,
    };
    const infoResult = await ffmpegExec(ffmpeg, ['-i', fileName]);
    const rawInfo = infoResult.stderr;
    // console.log('>> INFO');
    // console.log(rawInfo);
    // console.log('>> END INFO');
    let match = /(\d+)\sfps/i.exec(rawInfo);
    if (match?.[1]) {
        result.fps = parseInt(match[1], 10);
    }
    match = /Stream.+?Video.+?(\d{3,})x(\d{3,})/i.exec(rawInfo);
    if (match?.[1]) {
        result.width = parseInt(match[1], 10);
        result.height = parseInt(match[2], 10);
    }
    return result;
}

export const ffmpegListFiles = async (ffmpeg: FFmpeg, path: string) =>
    ( await ffmpeg.listDir(path) ).filter((p) => !( ['.', '..'].includes(p.name) && p.isDir ));

export const ffmpegListFilesRaw = async (ffmpeg: FFmpeg, path: string) =>
    ( await ffmpegListFiles(ffmpeg, path) ).map((item) => item.name);
