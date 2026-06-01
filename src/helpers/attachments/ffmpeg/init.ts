import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const pkgVersion = '0.12.6';
const pkgName = 'core';
// const baseURL = `https://unpkg.com/@ffmpeg/${pkgName}@${pkgVersion}/dist/esm`;
const ffmpegUrlPrefix = '';
const baseURL = `${ffmpegUrlPrefix}/ffmpeg-${pkgName}/${pkgVersion}`;
export async function loadFFMpeg(ffmpeg: FFmpeg) {
    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        // workerURL: await toBlobURL(`${baseURL}/ffmpeg-core.worker.js`, 'text/javascript')
    });
}

let _ffmpeg: FFmpeg | null = null;

export async function initFfmpeg() {
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
}
