import { calculateVideoSize } from './calculateVideoSize';
import { Size } from './types';

describe('calculateVideoSize', () => {
    it.each([
        ['keeps small landscape video', { width: 720, height: 404 }, { width: 720, height: 404 }],
        ['keeps small portrait video', { width: 404, height: 720 }, { width: 404, height: 720 }],
        ['keeps square video at boundary', { width: 720, height: 720 }, { width: 720, height: 720 }],
        ['scales large landscape video by smaller side', { width: 1920, height: 1080 }, { width: 1280, height: 720 }],
        ['scales large portrait video by smaller side', { width: 1080, height: 1920 }, { width: 720, height: 1280 }],
        ['scales square video over boundary to target side', { width: 800, height: 800 }, { width: 720, height: 720 }],
        ['rounds scaled dimensions to even numbers', { width: 1235, height: 1025 }, { width: 868, height: 720 }],
    ] satisfies Array<[string, Size, Size]>)('%s', (_title, originalSize, expectedSize) => {
        expect(calculateVideoSize(originalSize)).toEqual(expectedSize);
    });
});
