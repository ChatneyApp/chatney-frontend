import { calculateCroppedVideoSize, Size } from './calculateCroppedVideoSize';

describe('calculateCroppedVideoSize', () => {
    const desiredSize: Size = { width: 576, height: 1080 };

    it('1:1 size', () => {
        const originalSize: Size = { width: 576, height: 1080 };
        const expectedSize: Size = { width: 576, height: 1080 };
        const result = calculateCroppedVideoSize(originalSize, desiredSize);
        expect(result).toEqual(expectedSize);
    });

    it('Same ratio scale', () => {
        const originalSize: Size = { width: 1152, height: 2160 };
        const expectedSize: Size = { width: 576, height: 1080 };
        const result = calculateCroppedVideoSize(originalSize, desiredSize);
        expect(result).toEqual(expectedSize);
    });

    it('Wide video, larger', () => {
        const originalSize: Size = { width: 1200, height: 2160 };
        const expectedSize: Size = { width: 600, height: 1080 };
        const result = calculateCroppedVideoSize(originalSize, desiredSize);
        expect(result).toEqual(expectedSize);
    });

    it('Wide video, smaller', () => {
        const originalSize: Size = { width: 300, height: 540 };
        const expectedSize: Size = { width: 600, height: 1080 };
        const result = calculateCroppedVideoSize(originalSize, desiredSize);
        expect(result).toEqual(expectedSize);
    });

    it('Narrow video, larger', () => {
        const originalSize: Size = { width: 1000, height: 2160 };
        const expectedSize: Size = { width: 500, height: 1080 };
        const result = calculateCroppedVideoSize(originalSize, desiredSize);
        expect(result).toEqual(expectedSize);
    });

    it('Narrow video, smaller', () => {
        const originalSize: Size = { width: 250, height: 540 };
        const expectedSize: Size = { width: 500, height: 1080 };
        const result = calculateCroppedVideoSize(originalSize, desiredSize);
        expect(result).toEqual(expectedSize);
    });
});
