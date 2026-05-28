export interface Size {
    width: number;
    height: number;
}
export const calculateCroppedVideoSize = (originalSize: Size, desiredSize: Size): Size => {
    const originalRatio = originalSize.width / originalSize.height;

    return {
        width: Math.round(desiredSize.height * originalRatio),
        height: desiredSize.height,
    };
};
