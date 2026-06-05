import { fetchFile } from '@ffmpeg/util';
import type { FFmpeg } from '@ffmpeg/ffmpeg';

import type { AudioConfig } from '../types';
import { compileFfmpegAudioParams } from './config';
import type { FFmpegExecResult, ProgressEvent } from '../types';
import { initFfmpeg } from './init';
import { ffmpegExec, ffmpegListFilesRaw } from './generic';

const AUDIO_TMP = {
    source: 'input.mp3',
    result: 'output.mp3',
};

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

    await putInputFile(ffmpeg, inputFile, AUDIO_TMP.source);

    const command = [
        '-i', AUDIO_TMP.source,
        ...compileFfmpegAudioParams(audioConfig),
        AUDIO_TMP.result,
    ];

    console.log(command.join(' '));
    const output = await ffmpegExec(ffmpeg, command, updateEncodingStatus, signal);

    const data = await ffmpeg.readFile(AUDIO_TMP.result) as Uint8Array;
    const conversionFailed = hasConversionError(output);
    const result = new Blob([new Uint8Array(data)], { type: 'audio/mpeg' });
    console.log('generate result (blob)', result);

    console.error(output.stderr);
    console.error('AFTER dir [.]');
    console.table(await ffmpegListFilesRaw(ffmpeg, '.'));

    await removeIfPresent(ffmpeg, [AUDIO_TMP.source, AUDIO_TMP.result]);
    console.log(`preprocessAudio done in ${Date.now() - startTime}ms`);

    if (conversionFailed) {
        throw new Error('Audio cannot be processed');
    }

    return result;
}
