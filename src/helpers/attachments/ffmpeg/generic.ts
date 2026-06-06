import { FFmpeg } from '@ffmpeg/ffmpeg';

import { FFmpegExecResult, ProgressEvent, VideoProperties } from '../types';

const FPS_RE = /(\d+)\sfps/i;
const VIDEO_SIZE_RE = /Stream.+?Video.+?(\d{3,})x(\d{3,})/i;
const SKIP_DIR_ITEMS = new Set(['.', '..']);

function flattenLogBuckets(logs: Record<string, string[]>): FFmpegExecResult {
    return Object.fromEntries(
        Object.entries(logs).map(([type, entries]) => [type, entries.join('\n')]),
    );
}

function parseVideoInfo(stderr = ''): VideoProperties {
    const fpsMatch = FPS_RE.exec(stderr);
    const sizeMatch = VIDEO_SIZE_RE.exec(stderr);

    return {
        fps: fpsMatch?.[1] ? parseInt(fpsMatch[1], 10) : 0,
        width: sizeMatch?.[1] ? parseInt(sizeMatch[1], 10) : 0,
        height: sizeMatch?.[2] ? parseInt(sizeMatch[2], 10) : 0,
    };
}

export async function ffmpegExec(
    ffmpeg: FFmpeg,
    args: string[],
    progressCallback?: (e: ProgressEvent) => void,
    signal?: AbortSignal,
): Promise<FFmpegExecResult> {
    const logs: Record<string, string[]> = {};
    const collectLog = ({ message, type }: { message: string; type: string }) => {
        logs[type] ??= [];
        logs[type].push(message);
    };

    ffmpeg.on('log', collectLog);
    if (progressCallback) {
        ffmpeg.on('progress', progressCallback);
    }

    try {
        await ffmpeg.exec(args, undefined, { signal });
    } catch (e) {
        console.error('ffmpegExec err', e);
    } finally {
        ffmpeg.off('log', collectLog);
        if (progressCallback) {
            ffmpeg.off('progress', progressCallback);
        }
    }

    return flattenLogBuckets(logs);
}

export async function getVideoProperties(ffmpeg: FFmpeg, fileName: string): Promise<VideoProperties> {
    const probe = await ffmpegExec(ffmpeg, ['-i', fileName]);

    return parseVideoInfo(probe.stderr);
}

export const ffmpegListFiles = async (ffmpeg: FFmpeg, path: string) =>
    (await ffmpeg.listDir(path)).filter((item) => !(SKIP_DIR_ITEMS.has(item.name) && item.isDir));

export const ffmpegListFilesRaw = async (ffmpeg: FFmpeg, path: string) =>
    (await ffmpegListFiles(ffmpeg, path)).map(({ name }) => name);
