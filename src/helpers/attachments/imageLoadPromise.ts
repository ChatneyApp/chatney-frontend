export const imageLoadPromise = async (img: HTMLImageElement): Promise<void> => new Promise((resolve, reject) => {
    img.addEventListener('load', () => resolve());
    img.addEventListener('error', () => reject());
});
