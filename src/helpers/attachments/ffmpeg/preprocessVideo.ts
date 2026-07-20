import { fetchFile } from '@ffmpeg/util';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

import type { VideoConfig } from '../types';
import { compileFfmpegVideoParams } from './config';
import { calculateFittingSize } from '../calculateFittingSize';
import type { FFmpegExecResult, ProgressEvent, Size } from '../types';
import { initFfmpeg } from './init';
import { ffmpegExec, ffmpegListFilesRaw, getVideoProperties } from './generic';

const TARGET_SIDE = 720;

const VIDEO_RESULT_TMP = 'output.mp4';

const VIDEO_INPUT_EXTENSIONS: Record<string, string> = {
    'video/webm': 'webm',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
    'video/x-matroska': 'mkv',
    'video/ogg': 'ogv',
};

function getSourceFileName(mimeType: string) {
    const baseMimeType = mimeType.split(';')[0].trim().toLowerCase();
    const extension = VIDEO_INPUT_EXTENSIONS[baseMimeType] ?? 'mp4';

    return `input.${extension}`;
}

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

    const sourceFileName = getSourceFileName(inputFile.type);
    await mountInput(ffmpeg, inputFile, sourceFileName);

    const inputVideoProps = await getVideoProperties(ffmpeg, sourceFileName);
    console.log('inputVideoProps');
    console.table(inputVideoProps);

    const outputVideoSize = calculateFittingSize(inputVideoProps, TARGET_SIDE);
    console.log('outputVideoSize');
    console.table(outputVideoSize);

    const command = [
        '-i', sourceFileName,
        '-filter:v',
        buildVideoFilter(outputVideoSize),
        ...compileFfmpegVideoParams(videoConfig),
        VIDEO_RESULT_TMP,
    ];

    console.log(command.join(' '));
    const output = await ffmpegExec(ffmpeg, command, updateEncodingStatus, signal);

    const outputVideoProps = await getVideoProperties(ffmpeg, VIDEO_RESULT_TMP);
    console.log('outputVideoProps');
    console.table(outputVideoProps);

    const data = await ffmpeg.readFile(VIDEO_RESULT_TMP) as Uint8Array;
    const failed = conversionFailed(output);
    const result = new Blob([new Uint8Array(data)], { type: 'video/mp4' });
    console.log('generated video result (blob)', result);

    console.error(output.stderr);
    console.error('AFTER dir [.]');
    console.table(await ffmpegListFilesRaw(ffmpeg, '.'));

    await discardFiles(ffmpeg, [sourceFileName, VIDEO_RESULT_TMP]);
    console.log(`preprocessVideo done in ${Date.now() - startTime}ms`);

    if (failed) {
        throw new Error('Video cannot be processed');
    }

    return result;
}
