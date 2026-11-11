import { clampCrop, getCropSourceRect, getInitialCrop, MAX_AVATAR_ZOOM, zoomCrop } from './avatarCrop';

const landscape = { width: 400, height: 200 };
const viewport = 100;

describe('avatarCrop', () => {
    it('centres the image and fills the viewport with its shorter side', () => {
        expect(getInitialCrop(landscape, viewport)).toEqual({ zoom: 1, x: -50, y: 0 });
        expect(getCropSourceRect(landscape, viewport, getInitialCrop(landscape, viewport)))
            .toEqual({ x: 100, y: 0, size: 200 });
    });

    it('does not let the image leave the viewport', () => {
        expect(clampCrop(landscape, viewport, { zoom: 1, x: 30, y: 30 })).toEqual({ zoom: 1, x: 0, y: 0 });
        expect(clampCrop(landscape, viewport, { zoom: 1, x: -500, y: -500 })).toEqual({ zoom: 1, x: -100, y: 0 });
    });

    it('limits the zoom', () => {
        expect(clampCrop(landscape, viewport, { zoom: 100, x: 0, y: 0 }).zoom).toBe(MAX_AVATAR_ZOOM);
        expect(clampCrop(landscape, viewport, { zoom: 0, x: 0, y: 0 }).zoom).toBe(1);
    });

    it('zooms around the viewport centre', () => {
        const zoomed = zoomCrop(landscape, viewport, getInitialCrop(landscape, viewport), 2);

        expect(zoomed).toEqual({ zoom: 2, x: -150, y: -50 });
        expect(getCropSourceRect(landscape, viewport, zoomed)).toEqual({ x: 150, y: 50, size: 100 });
    });

    it('re-clamps the position when zooming out at an edge', () => {
        const atEdge = clampCrop(landscape, viewport, { zoom: 2, x: -300, y: -100 });

        expect(zoomCrop(landscape, viewport, atEdge, 1)).toEqual({ zoom: 1, x: -100, y: 0 });
    });
});
