import { KeyboardEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import {
    AVATAR_SIZE,
    clampCrop,
    CropState,
    getCropScale,
    getCropSourceRect,
    getInitialCrop,
    ImageSize,
    MAX_AVATAR_ZOOM,
    MIN_AVATAR_ZOOM,
    zoomCrop,
} from '@/helpers/avatarCrop';

import styles from './AvatarCropDialog.module.css';

/** Side of the square crop area in CSS pixels. Must match `.viewport` in the CSS module. */
const VIEWPORT_SIZE = 240;
const KEYBOARD_STEP = 8;
const ZOOM_STEP = 0.1;

type Props = {
    /** The picked image. The dialog is open while this is set. */
    file: File | null;
    onCancel: () => void;
    onConfirm: (avatar: Blob) => void;
    loading?: boolean;
    error?: string | null;
};

/** Draws the cropped square as an AVATAR_SIZE png. Halves the image in steps, which downscales large photos more cleanly. */
function renderAvatar(image: HTMLImageElement, sourceRect: { x: number; y: number; size: number }): Promise<Blob> {
    let source: CanvasImageSource = image;
    let { x, y, size } = sourceRect;

    const draw = (targetSize: number) => {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const context = canvas.getContext('2d');
        if (!context) {
            throw new Error('Canvas is not available');
        }
        context.imageSmoothingQuality = 'high';
        context.drawImage(source, x, y, size, size, 0, 0, targetSize, targetSize);
        return canvas;
    };

    while (size > AVATAR_SIZE * 2) {
        const nextSize = Math.floor(size / 2);
        source = draw(nextSize);
        x = 0;
        y = 0;
        size = nextSize;
    }

    return new Promise((resolve, reject) => {
        draw(AVATAR_SIZE).toBlob(
            (blob) => (blob ? resolve(blob) : reject(new Error('Could not encode the avatar'))),
            'image/png',
        );
    });
}

function AvatarCropForm({ file, onConfirm, loading, error }: Omit<Props, 'file' | 'onCancel'> & { file: File }) {
    const { t } = useTranslation();
    const imageRef = useRef<HTMLImageElement | null>(null);
    const dragRef = useRef<{ pointerX: number; pointerY: number; x: number; y: number } | null>(null);

    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<ImageSize | null>(null);
    const [crop, setCrop] = useState<CropState>({ zoom: MIN_AVATAR_ZOOM, x: 0, y: 0 });
    const [unreadable, setUnreadable] = useState(false);
    const [rendering, setRendering] = useState(false);

    useEffect(() => {
        const url = URL.createObjectURL(file);
        setImageUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const updateCrop = (update: (crop: CropState, image: ImageSize) => CropState) => {
        if (imageSize) {
            setCrop((current) => update(current, imageSize));
        }
    };
    const moveBy = (dx: number, dy: number) => updateCrop((current, image) => (
        clampCrop(image, VIEWPORT_SIZE, { ...current, x: current.x + dx, y: current.y + dy })
    ));
    const zoomTo = (getZoom: (zoom: number) => number) => updateCrop((current, image) => (
        zoomCrop(image, VIEWPORT_SIZE, current, getZoom(current.zoom))
    ));

    const handleImageLoad = () => {
        const image = imageRef.current;
        if (!image || !image.naturalWidth || !image.naturalHeight) {
            setUnreadable(true);
            return;
        }

        const size = { width: image.naturalWidth, height: image.naturalHeight };
        setImageSize(size);
        setCrop(getInitialCrop(size, VIEWPORT_SIZE));
    };

    const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { pointerX: event.clientX, pointerY: event.clientY, x: crop.x, y: crop.y };
    };
    const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
        const drag = dragRef.current;
        if (!drag) {
            return;
        }

        const x = drag.x + event.clientX - drag.pointerX;
        const y = drag.y + event.clientY - drag.pointerY;
        updateCrop((current, image) => clampCrop(image, VIEWPORT_SIZE, { ...current, x, y }));
    };
    const handlePointerEnd = () => {
        dragRef.current = null;
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        switch (event.key) {
            case 'ArrowLeft':
                moveBy(KEYBOARD_STEP, 0);
                break;
            case 'ArrowRight':
                moveBy(-KEYBOARD_STEP, 0);
                break;
            case 'ArrowUp':
                moveBy(0, KEYBOARD_STEP);
                break;
            case 'ArrowDown':
                moveBy(0, -KEYBOARD_STEP);
                break;
            case '+':
            case '=':
                zoomTo((zoom) => zoom + ZOOM_STEP);
                break;
            case '-':
                zoomTo((zoom) => zoom - ZOOM_STEP);
                break;
            default:
                return;
        }
        event.preventDefault();
    };

    const handleConfirm = async () => {
        const image = imageRef.current;
        if (!image || !imageSize) {
            return;
        }

        setRendering(true);
        try {
            onConfirm(await renderAvatar(image, getCropSourceRect(imageSize, VIEWPORT_SIZE, crop)));
        } catch {
            setUnreadable(true);
        } finally {
            setRendering(false);
        }
    };

    const scale = imageSize ? getCropScale(imageSize, VIEWPORT_SIZE, crop.zoom) : 0;
    const busy = loading || rendering;
    const shownError = unreadable ? t('profile.avatar.errors.unreadable') : error;

    return (
        <>
            <div
                className={styles.viewport}
                role="group"
                aria-label={t('profile.avatar.crop.areaLabel')}
                tabIndex={0}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
                onWheel={(event) => zoomTo((zoom) => zoom - Math.sign(event.deltaY) * ZOOM_STEP)}
                onKeyDown={handleKeyDown}
            >
                {imageUrl && (
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt=""
                        draggable={false}
                        className={styles.image}
                        style={imageSize ? {
                            width: imageSize.width * scale,
                            height: imageSize.height * scale,
                            transform: `translate(${crop.x}px, ${crop.y}px)`,
                        } : { visibility: 'hidden' }}
                        onLoad={handleImageLoad}
                        onError={() => setUnreadable(true)}
                    />
                )}
                <div className={styles.mask} />
            </div>

            <label className={styles.zoomRow}>
                <span className={styles.zoomLabel}>{t('profile.avatar.crop.zoom')}</span>
                <input
                    type="range"
                    className={styles.zoomSlider}
                    min={MIN_AVATAR_ZOOM}
                    max={MAX_AVATAR_ZOOM}
                    step={0.01}
                    value={crop.zoom}
                    disabled={!imageSize}
                    onChange={(event) => zoomTo(() => Number(event.target.value))}
                />
            </label>

            {shownError && (
                <div role="alert" className={styles.errorMessage}>{shownError}</div>
            )}

            <div className={styles.bottomButtons}>
                <Dialog.Close asChild>
                    <button type="button" className={styles.cancelButton}>
                        {t('common.cancel')}
                    </button>
                </Dialog.Close>
                <button
                    type="button"
                    className={styles.submitButton}
                    onClick={handleConfirm}
                    disabled={busy || !imageSize || unreadable}
                >
                    {busy ? t('profile.avatar.uploading') : t('profile.avatar.crop.confirm')}
                </button>
            </div>
        </>
    );
}

/** Lets the user position and zoom a picked image inside a square, and returns it as a 128×128 png. */
export function AvatarCropDialog({ file, onCancel, onConfirm, loading, error }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog.Root
            open={file !== null}
            onOpenChange={(open) => {
                if (!open) {
                    onCancel();
                }
            }}
        >
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container}>
                    <Dialog.Title className={styles.title}>{t('profile.avatar.crop.title')}</Dialog.Title>
                    <Dialog.Description className={styles.description}>
                        {t('profile.avatar.crop.description')}
                    </Dialog.Description>
                    {file && (
                        <AvatarCropForm file={file} onConfirm={onConfirm} loading={loading} error={error} />
                    )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
