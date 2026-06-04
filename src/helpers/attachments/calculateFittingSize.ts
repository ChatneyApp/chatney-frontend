import type { Size } from './types';

const roundToEven = (value: number) => Math.max(2, Math.round(value / 2) * 2);

export function calculateFittingSize(originalSize: Size, targetSide: number): Size {
    if (originalSize.width <= targetSide && originalSize.height <= targetSide) {
        return originalSize;
    }

    const minSide = Math.min(originalSize.width, originalSize.height);
    const scale = targetSide / minSide;

    return {
        width: roundToEven(originalSize.width * scale),
        height: roundToEven(originalSize.height * scale),
    };
}
