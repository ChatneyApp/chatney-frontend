export const debugCanvas = (canvas: HTMLCanvasElement) => {
    const { width, height } = canvas;
    const img = canvas.toDataURL('image/png');
    console.log(img);
    console.log('%c ', `color: transparent;font-size:1px;width:${width}px;height:${height}px;background:transparent url('${img}') no-repeat 0 0;background-zie: ${width}px ${height}px;`);
};

export const hexToUint8Array = (hex: string) => {
    const len = hex.length / 2;
    const arr = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        const h = hex.substring(i * 2, (i + 1) * 2);
        arr[i] = parseInt(h, 16);
    }

    return arr;
};

function uuidv4() {
    // RFC 4122 version 4 compliant
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);

    // version = 4
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    // variant = 10xxxxxx
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = [...bytes].map(b => b.toString(16).padStart(2, '0')).join('');
    return (
        hex.slice(0, 8) + '-' +
        hex.slice(8, 12) + '-' +
        hex.slice(12, 16) + '-' +
        hex.slice(16, 20) + '-' +
        hex.slice(20)
    );
}

export const genUuid = () => {
    if (typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }

    return uuidv4();
}

export const downloadBlob = (data: Blob, filename: string) => {
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
};
export const wait = (ms: number) => new Promise((resolve) => {
    setTimeout(resolve, ms);
});

export const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(1)} KB`;
    }

    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};
