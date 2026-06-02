import { fetchFile } from '@ffmpeg/util';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

import type { VideoConfig } from './config';
import { compileFfmpegVideoParams, NORMALIZED_VIDEO_BG_COLOR, NORMALIZED_VIDEO_SIZE } from './config';
import { calculateCroppedVideoSize } from './calculateCroppedVideoSize';
import type { FFmpegExecResult, ProgressEvent, Size, VideoProperties } from './types';
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

function buildVideoFilter(input: VideoProperties, frame: Size) {
    const sourceRatio = input.width / input.height;
    const targetRatio = frame.width / frame.height;

    if (sourceRatio > targetRatio) {
        return `scale=-2:${frame.height},crop=${frame.width}:${frame.height}`;
    }

    return `scale=-2:${frame.height},pad=${frame.width}:${frame.height}:(iw-ow)/2:(ih-oh)/2:${NORMALIZED_VIDEO_BG_COLOR}`;
}

function conversionFailed(output: FFmpegExecResult) {
    return output.stderr?.includes('Conversion failed!') ?? false;
}

export async function convertVideo(
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

    const outputVideoSize = calculateCroppedVideoSize(inputVideoProps, NORMALIZED_VIDEO_SIZE);
    console.log('outputVideoSize');
    console.table(outputVideoSize);

    const command = [
        '-i', VIDEO_TMP.source,
        '-filter:v',
        buildVideoFilter(inputVideoProps, NORMALIZED_VIDEO_SIZE),
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
    console.log(`convertVideo done in ${Date.now() - startTime}ms`);

    if (failed) {
        throw new Error('Video cannot be processed');
    }

    return result;
}
