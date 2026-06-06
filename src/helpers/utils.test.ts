import { formatFileSize, hexToUint8Array } from './utils';

describe('hexToUint8Array', () => {
    it.each([
        ['', []],
        ['00', [0]],
        ['0f10ff', [15, 16, 255]],
        ['A1b2C3', [161, 178, 195]],
    ] satisfies Array<[string, number[]]>)('converts %s to bytes', (hex, expectedBytes) => {
        expect([...hexToUint8Array(hex)]).toEqual(expectedBytes);
    });
});

describe('formatFileSize', () => {
    it.each([
        [0, '0 B'],
        [1, '1 B'],
        [1023, '1023 B'],
        [1024, '1.0 KB'],
        [1536, '1.5 KB'],
        [1024 * 1024 - 1, '1024.0 KB'],
        [1024 * 1024, '1.0 MB'],
        [2.5 * 1024 * 1024, '2.5 MB'],
    ] satisfies Array<[number, string]>)('formats %s bytes as %s', (size, expectedSize) => {
        expect(formatFileSize(size)).toBe(expectedSize);
    });
});
