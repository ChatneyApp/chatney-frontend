import { fetchFile } from '@ffmpeg/util';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

import type { AudioConfig } from '../types';
import { compileFfmpegAudioParams } from './config';
import type { FFmpegExecResult, ProgressEvent } from '../types';
import { initFfmpeg } from './init';
import { ffmpegExec, ffmpegListFilesRaw } from './generic';

const AUDIO_RESULT_TMP = 'output.mp3';

const AUDIO_INPUT_EXTENSIONS: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/mp4': 'm4a',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/flac': 'flac',
    'audio/aac': 'aac',
};

function getSourceFileName(mimeType: string) {
    const baseMimeType = mimeType.split(';')[0].trim().toLowerCase();
    const extension = AUDIO_INPUT_EXTENSIONS[baseMimeType] ?? 'mp3';

    return `input.${extension}`;
}

const reportProgress = (callback?: (progress: number) => void) =>
    ({ progress }: ProgressEvent) => callback?.(progress);

async function putInputFile(ffmpeg: FFmpeg, file: File, path: string) {
    await ffmpeg.writeFile(path, await fetchFile(file));
}

async function removeIfPresent(ffmpeg: FFmpeg, names: string[]) {
    const currentFiles = await ffmpegListFilesRaw(ffmpeg, '.');

    await Promise.all(
        names
            .filter((name) => currentFiles.includes(name))
            .map((name) => ffmpeg.deleteFile(name)),
    );
}

function hasConversionError(output: FFmpegExecResult) {
    return output.stderr?.includes('Conversion failed!') ?? false;
}

export async function preprocessAudio(
    inputFile: File,
    audioConfig: AudioConfig,
    setEncodingProgress?: ((progress: number) => void),
    signal?: AbortSignal,
): Promise<Blob> {
    const ffmpeg = await initFfmpeg();
    if (!ffmpeg) {
        throw new Error('FFmpeg not loaded');
    }
    const startTime = Date.now();
    const updateEncodingStatus = reportProgress(setEncodingProgress);

    const sourceFileName = getSourceFileName(inputFile.type);
    await putInputFile(ffmpeg, inputFile, sourceFileName);

    const command = [
        '-i', sourceFileName,
        ...compileFfmpegAudioParams(audioConfig),
        AUDIO_RESULT_TMP,
    ];

    console.log(command.join(' '));
    const output = await ffmpegExec(ffmpeg, command, updateEncodingStatus, signal);

    const data = await ffmpeg.readFile(AUDIO_RESULT_TMP) as Uint8Array;
    const conversionFailed = hasConversionError(output);
    const result = new Blob([new Uint8Array(data)], { type: 'audio/mpeg' });
    console.log('generate result (blob)', result);

    console.error(output.stderr);
    console.error('AFTER dir [.]');
    console.table(await ffmpegListFilesRaw(ffmpeg, '.'));

    await removeIfPresent(ffmpeg, [sourceFileName, AUDIO_RESULT_TMP]);
    console.log(`preprocessAudio done in ${Date.now() - startTime}ms`);

    if (conversionFailed) {
        throw new Error('Audio cannot be processed');
    }

    return result;
}
