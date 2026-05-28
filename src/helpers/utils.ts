import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

export interface VideoProperties {
    fps: number;
}

export interface ProgressEvent {
    progress: number;
    time: number;
}

export const ffmpegExec = async (ffmpeg: FFmpeg, args: string[], progressCallback?: (e: ProgressEvent) => void, signal?: AbortSignal) => {
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
            .map(([k, v]) => [k, v.join('\n')])
    );
};

export const getVideoProperties = async (ffmpeg: FFmpeg, fileName: string): Promise<VideoProperties> => {
    const result: VideoProperties = {
        fps: 0,
    };
    const infoResult = await ffmpegExec(ffmpeg, ['-i', fileName]);
    const match = /(\d+)\sfps/i.exec(infoResult.stderr);
    if (match?.[1]) {
        result.fps = parseInt(match[1], 10);
    }
    return result;
};

export const ffmpegListFiles = async (ffmpeg: FFmpeg, path: string)=>
    (await ffmpeg.listDir(path)).filter(p => !(['.', '..'].includes(p.name) && p.isDir));
export const ffmpegListFilesRaw = async (ffmpeg: FFmpeg, path: string)=>
    (await ffmpegListFiles(ffmpeg, path)).map(item => item.name);

export const debugCanvas = (canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;
    const img = canvas.toDataURL('image/png');
    console.log(img);
    console.log('%c ', `color: transparent;font-size:1px;width:${width}px;height:${height}px;background:transparent url('${img}') no-repeat 0 0;background-zie: ${width}px ${height}px;`);
};

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

export const hexToUint8Array = (hex: string) => {
    const len = hex.length / 2;
    const arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        const h = hex.substring(i * 2, (i + 1) * 2);
        arr[i] = parseInt(h, 16);
    }

    return arr;
};

function uuidv4() {
    // RFC 4122 version 4 compliant
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // version = 4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // variant = 10xxxxxx
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    return (
        hex.slice(0, 8) + '-' +
        hex.slice(8, 12) + '-' +
        hex.slice(12, 16) + '-' +
        hex.slice(16, 20) + '-' +
        hex.slice(20)
    );
}

export const genUuid = () => {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return uuidv4();
}
