export const WAVEFORM_BARS = 120;
export const MIN_BAR_HEIGHT = 3;
export const MAX_BAR_HEIGHT = 24;
export const EMPTY_WAVEFORM = Array.from({ length: WAVEFORM_BARS }, () => MIN_BAR_HEIGHT);

export const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) {
        return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60).toString().padStart(2, '0');

    return `${minutes}:${rest}`;
};

export const getAudioContext = () => {
    const windowWithWebkitAudio = window as Window & typeof globalThis & {
        webkitAudioContext?: typeof AudioContext;
    };

    return new (window.AudioContext ?? windowWithWebkitAudio.webkitAudioContext!)();
};

export const calculateWaveform = (audioBuffer: AudioBuffer) => {
    const rawAmplitudes = Array.from({ length: WAVEFORM_BARS }, (_, index) => {
        const start = Math.floor((audioBuffer.length * index) / WAVEFORM_BARS);
        const end = Math.floor((audioBuffer.length * (index + 1)) / WAVEFORM_BARS);
        let peak = 0;

        for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
            const channelData = audioBuffer.getChannelData(channel);

            for (let sample = start; sample < end; sample += 1) {
                peak = Math.max(peak, Math.abs(channelData[sample]));
            }
        }

        return peak;
    });

    const sortedAmplitudes = [...rawAmplitudes].sort((a, b) => a - b);
    const referenceAmplitude = sortedAmplitudes[Math.floor(sortedAmplitudes.length * 0.95)] ?? 0;
    if (referenceAmplitude === 0) {
        return EMPTY_WAVEFORM;
    }

    return rawAmplitudes.map((amplitude) => {
        const normalized = Math.min(1, amplitude / referenceAmplitude);
        const accentuated = Math.sqrt(normalized);

        return MIN_BAR_HEIGHT + Math.round(accentuated * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT));
    });
};

export const drawRoundedRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
};
