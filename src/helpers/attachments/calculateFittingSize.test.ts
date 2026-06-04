import { calculateFittingSize } from './calculateFittingSize';
import type { Size } from './types';

describe('calculateFittingSize', () => {
    it.each([
        ['keeps small landscape size', { width: 720, height: 404 }, 720, { width: 720, height: 404 }],
        ['keeps small portrait size', { width: 404, height: 720 }, 720, { width: 404, height: 720 }],
        ['keeps square size at boundary', { width: 720, height: 720 }, 720, { width: 720, height: 720 }],
        ['scales large landscape size by smaller side', { width: 1920, height: 1080 }, 720, { width: 1280, height: 720 }],
        ['scales large portrait size by smaller side', { width: 1080, height: 1920 }, 720, { width: 720, height: 1280 }],
        ['scales square size over boundary to target side', { width: 800, height: 800 }, 720, { width: 720, height: 720 }],
        ['rounds scaled dimensions to even numbers', { width: 1235, height: 1025 }, 720, { width: 868, height: 720 }],
        ['uses custom target side', { width: 800, height: 600 }, 500, { width: 666, height: 500 }],
    ] satisfies Array<[string, Size, number, Size]>)('%s', (_title, originalSize, targetSide, expectedSize) => {
        expect(calculateFittingSize(originalSize, targetSide)).toEqual(expectedSize);
    });
});
