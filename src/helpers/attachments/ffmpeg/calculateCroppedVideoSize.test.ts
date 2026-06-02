import { calculateCroppedVideoSize } from './calculateCroppedVideoSize';
import { Size } from './types';

describe('calculateCroppedVideoSize', () => {
    const desiredSize: Size = { width: 576, height: 1080 };

    it.each([
        ['keeps already normalized frame', { width: 576, height: 1080 }, { width: 576, height: 1080 }],
        ['downscales matching ratio', { width: 1152, height: 2160 }, { width: 576, height: 1080 }],
        ['downscales wide source', { width: 1200, height: 2160 }, { width: 600, height: 1080 }],
        ['upscales wide source', { width: 300, height: 540 }, { width: 600, height: 1080 }],
        ['downscales narrow source', { width: 1000, height: 2160 }, { width: 500, height: 1080 }],
        ['upscales narrow source', { width: 250, height: 540 }, { width: 500, height: 1080 }],
    ] satisfies Array<[string, Size, Size]>)('%s', (_title, originalSize, expectedSize) => {
        expect(calculateCroppedVideoSize(originalSize, desiredSize)).toEqual(expectedSize);
    });
});
