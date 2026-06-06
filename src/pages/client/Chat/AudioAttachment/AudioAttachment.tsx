import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent } from 'react';
import { Pause, Play } from 'lucide-react';

import { Attachment } from '@/types/attachments';

import styles from './AudioAttachment.module.css';

type Props = {
    attachment: Attachment;
    attachmentUrl: string;
};

const WAVEFORM_BARS = 120;
const MIN_BAR_HEIGHT = 3;
const MAX_BAR_HEIGHT = 24;
const EMPTY_WAVEFORM = Array.from({ length: WAVEFORM_BARS }, () => MIN_BAR_HEIGHT);

const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) {
        return '0:00';
    }

    const minutes = Math.floor(seconds / 60);
    const rest = Math.floor(seconds % 60).toString().padStart(2, '0');

    return `${minutes}:${rest}`;
};

const getAudioContext = () => {
    const windowWithWebkitAudio = window as Window & typeof globalThis & {
        webkitAudioContext?: typeof AudioContext;
    };

    return new (window.AudioContext ?? windowWithWebkitAudio.webkitAudioContext!)();
};

const calculateWaveform = (audioBuffer: AudioBuffer) => {
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

const readWaveform = async (attachmentUrl: string) => {
    const response = await fetch(attachmentUrl);
    const audioContext = getAudioContext();

    try {
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

        return calculateWaveform(audioBuffer);
    } finally {
        void audioContext.close();
    }
};

const drawRoundedRect = (
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

export const AudioAttachment = ({ attachment, attachmentUrl }: Props) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(attachment.duration ?? 0);
    const [waveform, setWaveform] = useState(EMPTY_WAVEFORM);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const progress = duration > 0 ? currentTime / duration : 0;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        const handleLoadedMetadata = () => setDuration(Number.isFinite(audio.duration) ? audio.duration : 0);
        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        readWaveform(attachmentUrl)
            .then((nextWaveform) => {
                if (!cancelled) {
                    setWaveform(nextWaveform);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setWaveform(EMPTY_WAVEFORM);
                }
            });

        return () => {
            cancelled = true;
        };
    }, [attachmentUrl]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const updateCanvasSize = () => {
            const rect = canvas.getBoundingClientRect();

            setCanvasSize({
                width: rect.width,
                height: rect.height,
            });
        };
        const resizeObserver = new ResizeObserver(updateCanvasSize);

        updateCanvasSize();
        resizeObserver.observe(canvas);

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const scale = window.devicePixelRatio || 1;
        const width = Math.max(1, Math.floor(canvasSize.width));
        const height = Math.max(1, Math.floor(canvasSize.height));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        canvas.width = Math.floor(width * scale);
        canvas.height = Math.floor(height * scale);
        ctx.setTransform(scale, 0, 0, scale, 0, 0);
        ctx.clearRect(0, 0, width, height);

        const step = width / waveform.length;
        const barWidth = Math.max(1, step * 0.48);
        const playedBars = progress * waveform.length;

        waveform.forEach((barHeight, index) => {
            const x = index * step + (step - barWidth) / 2;
            const y = (height - barHeight) / 2;
            const radius = Math.min(barWidth / 2, barHeight / 2);

            ctx.fillStyle = index < playedBars ? 'rgb(56 189 248)' : 'rgb(71 85 105)';
            drawRoundedRect(ctx, x, y, barWidth, barHeight, radius);
            ctx.fill();
        });
    }, [canvasSize, progress, waveform]);

    const togglePlayback = async () => {
        const audio = audioRef.current;
        if (!audio) {
            return;
        }

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
            return;
        }

        await audio.play();
        setIsPlaying(true);
    };

    const seekAudio = (element: HTMLElement, clientX: number) => {
        const audio = audioRef.current;
        if (!audio || duration <= 0) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        audio.currentTime = ratio * duration;
        setCurrentTime(audio.currentTime);
    };

    const handleWaveformClick = (event: MouseEvent<HTMLDivElement>) => {
        seekAudio(event.currentTarget, event.clientX);
    };

    const handleWaveformKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
        const audio = audioRef.current;
        if (!audio || duration <= 0) {
            return;
        }

        if (event.key === 'Home') {
            audio.currentTime = 0;
        } else if (event.key === 'End') {
            audio.currentTime = duration;
        } else if (event.key === 'ArrowLeft') {
            audio.currentTime = Math.max(0, audio.currentTime - 5);
        } else if (event.key === 'ArrowRight') {
            audio.currentTime = Math.min(duration, audio.currentTime + 5);
        } else {
            return;
        }

        event.preventDefault();
        setCurrentTime(audio.currentTime);
    };

    return (
        <div className={styles.audioPlayer}>
            <audio ref={audioRef} src={attachmentUrl} preload="metadata" />
            <button className={styles.audioButton} type="button" onClick={() => void togglePlayback()} aria-label={isPlaying ? 'Pause audio' : 'Play audio'}>
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
            <div className={styles.audioBody}>
                <div
                    className={styles.waveform}
                    onClick={handleWaveformClick}
                    onKeyDown={handleWaveformKeyDown}
                    role="slider"
                    tabIndex={0}
                    aria-label="Audio position"
                    aria-valuemin={0}
                    aria-valuemax={duration}
                    aria-valuenow={currentTime}
                >
                    <canvas className={styles.waveformCanvas} ref={canvasRef} />
                </div>
                <span className={styles.audioTime}>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </span>
            </div>
        </div>
    );
};
