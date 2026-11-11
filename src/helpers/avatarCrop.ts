/** Side of the uploaded avatar in pixels. The backend rejects any other size. */
export const AVATAR_SIZE = 128;
export const MIN_AVATAR_ZOOM = 1;
export const MAX_AVATAR_ZOOM = 4;

export type ImageSize = {
    width: number;
    height: number;
};

/**
 * Position of the image inside a square crop viewport.
 * `x`/`y` are the offset of the image's top-left corner from the viewport's, in viewport pixels (never positive).
 * At zoom 1 the image's shorter side fills the viewport.
 */
export type CropState = {
    zoom: number;
    x: number;
    y: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** Viewport pixels per image pixel. */
export function getCropScale(image: ImageSize, viewport: number, zoom: number): number {
    return (viewport / Math.min(image.width, image.height)) * zoom;
}

/** Keeps the zoom in range and the viewport fully covered by the image. */
export function clampCrop(image: ImageSize, viewport: number, crop: CropState): CropState {
    const zoom = clamp(crop.zoom, MIN_AVATAR_ZOOM, MAX_AVATAR_ZOOM);
    const scale = getCropScale(image, viewport, zoom);

    return {
        zoom,
        x: clamp(crop.x, viewport - image.width * scale, 0),
        y: clamp(crop.y, viewport - image.height * scale, 0),
    };
}

export function getInitialCrop(image: ImageSize, viewport: number): CropState {
    const scale = getCropScale(image, viewport, MIN_AVATAR_ZOOM);

    return clampCrop(image, viewport, {
        zoom: MIN_AVATAR_ZOOM,
        x: (viewport - image.width * scale) / 2,
        y: (viewport - image.height * scale) / 2,
    });
}

/** Changes the zoom, keeping the image point under the viewport centre in place. */
export function zoomCrop(image: ImageSize, viewport: number, crop: CropState, zoom: number): CropState {
    const nextZoom = clamp(zoom, MIN_AVATAR_ZOOM, MAX_AVATAR_ZOOM);
    const scale = getCropScale(image, viewport, crop.zoom);
    const nextScale = getCropScale(image, viewport, nextZoom);
    const half = viewport / 2;

    return clampCrop(image, viewport, {
        zoom: nextZoom,
        x: half - ((half - crop.x) / scale) * nextScale,
        y: half - ((half - crop.y) / scale) * nextScale,
    });
}

/** The visible square in image pixels. */
export function getCropSourceRect(image: ImageSize, viewport: number, crop: CropState) {
    const scale = getCropScale(image, viewport, crop.zoom);

    return {
        x: (0 - crop.x) / scale,
        y: (0 - crop.y) / scale,
        size: viewport / scale,
    };
}
