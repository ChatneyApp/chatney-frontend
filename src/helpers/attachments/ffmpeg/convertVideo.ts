import { fetchFile } from '@ffmpeg/util';

import type { VideoConfig } from './config';
import { compileFfmpegVideoParams, NORMALIZED_VIDEO_BG_COLOR, NORMALIZED_VIDEO_SIZE } from './config';
import { calculateCroppedVideoSize } from './calculateCroppedVideoSize';
import { ProgressEvent } from './types';
import { initFfmpeg } from './init';
import { ffmpegExec, ffmpegListFilesRaw, getVideoProperties } from './generic';

export async function convertVideo(
    inputFile: File,
    videoConfig: VideoConfig,
    setEncodingProgress?: ( (progress: number) => void ),
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
    const inputFileName = 'input.mp4';
    const outputFileName = 'output.mp4';
    const fetchedFile = await fetchFile(inputFile);
    await ffmpeg.writeFile(inputFileName, fetchedFile);

    // input video properties
    const inputVideoProps = await getVideoProperties(ffmpeg, inputFileName);
    console.log('inputVideoProps');
    console.table(inputVideoProps);

    const outputVideoSize = calculateCroppedVideoSize(inputVideoProps, NORMALIZED_VIDEO_SIZE);
    console.log('outputVideoSize');
    console.table(outputVideoSize);

    const { width: W, height: H } = NORMALIZED_VIDEO_SIZE;
    const isWider = inputVideoProps.width / inputVideoProps.height > W / H;

    // prepping command
    const compileCommandArgs: string[] = [
        '-i', inputFileName,
        '-filter:v',
        // wide
        isWider
            ? `scale=-2:${H},crop=${W}:${H}`
            : `scale=-2:${H},pad=${W}:${H}:(iw-ow)/2:(ih-oh)/2:${NORMALIZED_VIDEO_BG_COLOR}`,
    ];
    compileCommandArgs.push(
        ...compileFfmpegVideoParams(videoConfig),
        outputFileName,
    );
    // consoleLog('BEFORE dir [.]');
    // console.table(await ffmpegListFilesRaw(ffmpeg, '.'));

    // conversion
    console.log(compileCommandArgs.join(' '));
    const output = await ffmpegExec(ffmpeg, compileCommandArgs, updateEncodingStatus, signal);

    const outputVideoProps = await getVideoProperties(ffmpeg, outputFileName);
    console.log('outputVideoProps');
    console.table(outputVideoProps);

    const data = await ffmpeg.readFile(outputFileName) as Uint8Array;
    const conversionFailed = output.stderr.includes('Conversion failed!');
    const result = new Blob([new Uint8Array(data)], { type: 'video/mp4' });
    console.log('generated video result (blob)', result);

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
    console.log(`convertVideo done in ${Date.now() - startTime}ms`);

    if (conversionFailed) {
        throw new Error('Video cannot be processed');
    }

    return result;
};
