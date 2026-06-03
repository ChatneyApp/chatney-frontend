import { Size } from './types';

const TARGET_SIDE = 720;

const roundToEven = (value: number) => Math.max(2, Math.round(value / 2) * 2);

export function calculateVideoSize(originalSize: Size): Size {
    if (originalSize.width <= TARGET_SIDE && originalSize.height <= TARGET_SIDE) {
        return originalSize;
    }

    const minSide = Math.min(originalSize.width, originalSize.height);
    const scale = TARGET_SIDE / minSide;

    return {
        width: roundToEven(originalSize.width * scale),
        height: roundToEven(originalSize.height * scale),
    };
}
