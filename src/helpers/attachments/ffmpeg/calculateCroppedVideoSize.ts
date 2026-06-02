import { Size } from './types';

export function calculateCroppedVideoSize(originalSize: Size, desiredSize: Size): Size {
    const scale = desiredSize.height / originalSize.height;

    return {
        width: Math.round(originalSize.width * scale),
        height: desiredSize.height,
    };
}
