import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import type { AudioConfig, VideoConfig } from './config';
import {
    compileFfmpegAudioParams,
    compileFfmpegVideoParams,
    NORMALIZED_VIDEO_BG_COLOR,
    NORMALIZED_VIDEO_SIZE,
} from './config';
import { calculateCroppedVideoSize } from './calculateCroppedVideoSize';

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

export const ffmpegExec = async (
    ffmpeg: FFmpeg,
    args: string[],
    progressCallback?: (e: ProgressEvent) => void,
    signal?: AbortSignal,
): Promise<FFmpegExecResult> => {
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
};
export const getVideoProperties = async (ffmpeg: FFmpeg, fileName: string): Promise<VideoProperties> => {
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
};
export const ffmpegListFiles = async (ffmpeg: FFmpeg, path: string) => ( await ffmpeg.listDir(path) ).filter((p) => !( ['.', '..'].includes(p.name) && p.isDir ));
export const ffmpegListFilesRaw = async (ffmpeg: FFmpeg, path: string) => ( await ffmpegListFiles(ffmpeg, path) ).map((item) => item.name);

const pkgVersion = '0.12.6';
const pkgName = 'core';
// const baseURL = `https://unpkg.com/@ffmpeg/${pkgName}@${pkgVersion}/dist/esm`;
const ffmpegUrlPrefix = '';
const baseURL = `${ffmpegUrlPrefix}/ffmpeg-${pkgName}/${pkgVersion}`;
export const loadFFMpeg = async (ffmpeg: FFmpeg) => {
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    });
};
export const downloadBlob = (data: Blob, filename: string) => {
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
};
export const wait = (ms: number) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

let _ffmpeg: FFmpeg | null = null;

export const initFfmpeg = async () => {
    if (_ffmpeg) {
        return _ffmpeg;
    }

    try {
        _ffmpeg = new FFmpeg();
        console.log('ffmpeg: start loading...');
        await loadFFMpeg(_ffmpeg);
        console.log('ffmpeg: loaded');
    } catch (e) {
        console.error('ffmpeg: not loaded', e);
        _ffmpeg = null;
    }
    return _ffmpeg;
};

export const convertVideo = async (
    inputFile: File,
    videoConfig: VideoConfig,
    setEncodingProgress?: ( (progress: number) => void ),
    signal?: AbortSignal,
): Promise<Blob> => {
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
    console.log(`convertVideo done in ${Date.now() - startTime}ms`);

    if (conversionFailed) {
        throw new Error('Video cannot be processed');
    }

    return result;
};

export const convertAudio = async (
    inputFile: File,
    audioConfig: AudioConfig,
    setEncodingProgress?: ((progress: number) => void),
    signal?: AbortSignal,
): Promise<Blob> => {
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
