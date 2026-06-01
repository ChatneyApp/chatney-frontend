import { fetchFile } from '@ffmpeg/util';

import type { AudioConfig } from './config';
import { compileFfmpegAudioParams } from './config';
import { ProgressEvent } from './types';
import { initFfmpeg } from './init';
import { ffmpegExec, ffmpegListFilesRaw } from './generic';

export async function convertAudio(
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
    const updateEncodingStatus = ({ progress }: ProgressEvent) => {
        setEncodingProgress?.(progress);
    };

    // prepping files
    const inputFileName = 'input.mp3';
    const outputFileName = 'output.mp3';
    const fetchedFile = await fetchFile(inputFile);
    await ffmpeg.writeFile(inputFileName, fetchedFile);

    // prepping command
    const compileCommandArgs: string[] = [
        '-i', inputFileName,
    ];
    compileCommandArgs.push(
        ...compileFfmpegAudioParams(audioConfig),
        outputFileName,
    );
    // console.log('BEFORE dir [.]');
    // console.table(await ffmpegListFilesRaw(ffmpeg, '.'));

    // conversion
    console.log(compileCommandArgs.join(' '));
    const output = await ffmpegExec(ffmpeg, compileCommandArgs, updateEncodingStatus, signal);

    // console.log(output.stderr);
    // console.log('AFTER dir [.]');
    // console.table(await ffmpegListFilesRaw(ffmpeg, '.'));

    const data = await ffmpeg.readFile(outputFileName) as Uint8Array;
    const conversionFailed = output.stderr.includes('Conversion failed!');
    const result = new Blob([new Uint8Array(data)], { type: 'audio/mpeg' });
    console.log('generate result (blob)', result);

    console.error(output.stderr);
    console.error('AFTER dir [.]');
    console.table(await ffmpegListFilesRaw(ffmpeg, '.'));

    // cleanup
    const files = await ffmpegListFilesRaw(ffmpeg, '.');
    if (files.includes(inputFileName)) {
        await ffmpeg.deleteFile(inputFileName);
    }
    if (files.includes(outputFileName)) {
        await ffmpeg.deleteFile(outputFileName);
    }
    // console.log('CLEANED FILES dir [.]');
    // console.table(await ffmpegListFilesRaw(ffmpeg, '.'));
    console.log(`convertAudio done in ${Date.now() - startTime}ms`);

    if (conversionFailed) {
        throw new Error('Audio cannot be processed');
    }

    return result;
};
