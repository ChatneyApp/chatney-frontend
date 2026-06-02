import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL } from '@ffmpeg/util';

const CORE_PACKAGE = 'core';
const CORE_VERSION = '0.12.6';
const ASSET_ROOT = `/ffmpeg-${CORE_PACKAGE}/${CORE_VERSION}`;

function coreAssetUrl(fileName: string) {
    return `${ASSET_ROOT}/${fileName}`;
}

export async function loadFFMpeg(ffmpeg: FFmpeg) {
    await ffmpeg.load({
        coreURL: await toBlobURL(coreAssetUrl('ffmpeg-core.js'), 'text/javascript'),
        wasmURL: await toBlobURL(coreAssetUrl('ffmpeg-core.wasm'), 'application/wasm'),
    });
}

let ffmpegInstance: FFmpeg | null = null;

export async function initFfmpeg() {
    if (ffmpegInstance) {
        return ffmpegInstance;
    }

    try {
        ffmpegInstance = new FFmpeg();
        console.log('ffmpeg: start loading...');
        await loadFFMpeg(ffmpegInstance);
        console.log('ffmpeg: loaded');
    } catch (e) {
        console.error('ffmpeg: not loaded', e);
        ffmpegInstance = null;
    }

    return ffmpegInstance;
}
