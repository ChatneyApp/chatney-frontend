import { fetchFile } from '@ffmpeg/util';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

import type { VideoConfig } from './config';
import { compileFfmpegVideoParams } from './config';
import { calculateVideoSize } from './calculateVideoSize';
import type { FFmpegExecResult, ProgressEvent, Size } from './types';
import { initFfmpeg } from './init';
import { ffmpegExec, ffmpegListFilesRaw, getVideoProperties } from './generic';

const VIDEO_TMP = {
    source: 'input.mp4',
    result: 'output.mp4',
};

const pipeProgress = (callback?: (progress: number) => void) =>
    ({ progress }: ProgressEvent) => callback?.(progress);

async function mountInput(ffmpeg: FFmpeg, file: File, path: string) {
    await ffmpeg.writeFile(path, await fetchFile(file));
}

async function discardFiles(ffmpeg: FFmpeg, names: string[]) {
    const existing = new Set(await ffmpegListFilesRaw(ffmpeg, '.'));

    await Promise.all(
        names
            .filter((name) => existing.has(name))
            .map((name) => ffmpeg.deleteFile(name)),
    );
}

function buildVideoFilter(frame: Size) {
    return `scale=${frame.width}:${frame.height}`;
}

function conversionFailed(output: FFmpegExecResult) {
    return output.stderr?.includes('Conversion failed!') ?? false;
}

export async function preprocessVideo(
    inputFile: File,
    videoConfig: VideoConfig,
    setEncodingProgress?: ((progress: number) => void),
    signal?: AbortSignal,
): Promise<Blob> {
    const ffmpeg = await initFfmpeg();
    if (!ffmpeg) {
        throw new Error('FFmpeg not loaded');
    }
    const startTime = Date.now();
    const updateEncodingStatus = pipeProgress(setEncodingProgress);

    await mountInput(ffmpeg, inputFile, VIDEO_TMP.source);

    const inputVideoProps = await getVideoProperties(ffmpeg, VIDEO_TMP.source);
    console.log('inputVideoProps');
    console.table(inputVideoProps);

    const outputVideoSize = calculateVideoSize(inputVideoProps);
    console.log('outputVideoSize');
    console.table(outputVideoSize);

    const command = [
        '-i', VIDEO_TMP.source,
        '-filter:v',
        buildVideoFilter(outputVideoSize),
        ...compileFfmpegVideoParams(videoConfig),
        VIDEO_TMP.result,
    ];

    console.log(command.join(' '));
    const output = await ffmpegExec(ffmpeg, command, updateEncodingStatus, signal);

    const outputVideoProps = await getVideoProperties(ffmpeg, VIDEO_TMP.result);
    console.log('outputVideoProps');
    console.table(outputVideoProps);

    const data = await ffmpeg.readFile(VIDEO_TMP.result) as Uint8Array;
    const failed = conversionFailed(output);
    const result = new Blob([new Uint8Array(data)], { type: 'video/mp4' });
    console.log('generated video result (blob)', result);

    console.error(output.stderr);
    console.error('AFTER dir [.]');
    console.table(await ffmpegListFilesRaw(ffmpeg, '.'));

    await discardFiles(ffmpeg, [VIDEO_TMP.source, VIDEO_TMP.result]);
    console.log(`preprocessVideo done in ${Date.now() - startTime}ms`);

    if (failed) {
        throw new Error('Video cannot be processed');
    }

    return result;
}
