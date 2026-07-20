import { useEffect, useRef, useState } from 'react';
import { Mic, Pause, Play, RotateCcw, Square } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { Button } from '@/components/Button';
import { useRecordingSession } from '@/hooks/useRecordingSession';
import {
    EMPTY_WAVEFORM,
    MAX_BAR_HEIGHT,
    MIN_BAR_HEIGHT,
    WAVEFORM_BARS,
    calculateWaveform,
    drawRoundedRect,
    formatTime,
    getAudioContext,
} from '@/helpers/audio/waveform';

import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './VoiceRecorderModal.module.css';

type Props = {
    onClose: () => void;
    onRecorded: (file: File) => void;
};

const MIME_CANDIDATES = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
];

const FILE_EXTENSIONS: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/ogg': 'ogg',
    'audio/mp4': 'm4a',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
};

const LIVE_BAR_INTERVAL_MS = 50;

const getFileExtension = (mimeType: string) => {
    const baseMimeType = mimeType.split(';')[0].trim().toLowerCase();

    return FILE_EXTENSIONS[baseMimeType] ?? 'webm';
};

const drawBars = (canvas: HTMLCanvasElement, bars: number[], playedRatio: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    const width = Math.max(1, Math.floor(rect.width));
    const height = Math.max(1, Math.floor(rect.height));

    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const step = width / bars.length;
    const barWidth = Math.max(1, step * 0.48);
    const playedBars = playedRatio * bars.length;

    bars.forEach((barHeight, index) => {
        const x = index * step + (step - barWidth) / 2;
        const y = (height - barHeight) / 2;
        const radius = Math.min(barWidth / 2, barHeight / 2);

        ctx.fillStyle = index < playedBars ? 'rgb(56 189 248)' : 'rgb(71 85 105)';
        drawRoundedRect(ctx, x, y, barWidth, barHeight, radius);
        ctx.fill();
    });
};

const peakToBarHeight = (peak: number) => {
    const accentuated = Math.sqrt(Math.min(1, peak * 2));

    return MIN_BAR_HEIGHT + Math.round(accentuated * (MAX_BAR_HEIGHT - MIN_BAR_HEIGHT));
};

export function VoiceRecorderModal({ onClose, onRecorded }: Props) {
    const [previewWaveform, setPreviewWaveform] = useState(EMPTY_WAVEFORM);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const liveBarsRef = useRef<number[]>([]);

    const { stage, elapsedMs, preview, startRecording, pause, resume, stop, cancel } = useRecordingSession({
        constraints: { audio: true },
        mimeCandidates: MIME_CANDIDATES,
        fallbackMimeType: 'audio/webm',
        onStream: (stream) => {
            const audioContext = getAudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 1024;
            audioContext.createMediaStreamSource(stream).connect(analyser);
            analyserRef.current = analyser;
            liveBarsRef.current = [];
            setPreviewWaveform(EMPTY_WAVEFORM);
            setCurrentTime(0);
            setIsPlaying(false);

            return () => {
                analyserRef.current = null;
                void audioContext.close().catch(() => undefined);
            };
        },
    });

    // live scrolling waveform while recording
    useEffect(() => {
        const analyser = analyserRef.current;
        if (stage !== 'recording' || !analyser) {
            return;
        }

        const data = new Uint8Array(analyser.fftSize);
        let peakHold = 0;
        let lastBarAt = performance.now();
        let rafId = 0;

        const tick = () => {
            analyser.getByteTimeDomainData(data);
            let peak = 0;
            for (let i = 0; i < data.length; i += 1) {
                peak = Math.max(peak, Math.abs(data[i] - 128) / 128);
            }
            peakHold = Math.max(peakHold, peak);

            const now = performance.now();
            if (now - lastBarAt >= LIVE_BAR_INTERVAL_MS) {
                liveBarsRef.current = [...liveBarsRef.current, peakToBarHeight(peakHold)].slice(-WAVEFORM_BARS);
                peakHold = 0;
                lastBarAt = now;
            }

            if (canvasRef.current) {
                const padding = Array.from(
                    { length: WAVEFORM_BARS - liveBarsRef.current.length },
                    () => MIN_BAR_HEIGHT,
                );
                drawBars(canvasRef.current, [...padding, ...liveBarsRef.current], 1);
            }
            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafId);
    }, [stage]);

    // decode the finished take into a static waveform
    useEffect(() => {
        if (!preview) {
            return;
        }

        let cancelled = false;
        const audioContext = getAudioContext();

        preview.blob.arrayBuffer()
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then((audioBuffer) => {
                if (!cancelled) {
                    setPreviewWaveform(calculateWaveform(audioBuffer));
                }
            })
            .catch(() => undefined)
            .finally(() => void audioContext.close().catch(() => undefined));

        return () => {
            cancelled = true;
        };
    }, [preview]);

    // static waveform with playback progress in preview
    useEffect(() => {
        if (stage !== 'preview' || !canvasRef.current) {
            return;
        }

        const duration = elapsedMs / 1000;
        drawBars(canvasRef.current, previewWaveform, duration > 0 ? currentTime / duration : 0);
    }, [stage, previewWaveform, currentTime, elapsedMs]);

    const handleCancel = () => {
        cancel();
        onClose();
    };

    const togglePreviewPlayback = async () => {
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

    const handleAccept = () => {
        if (!preview) {
            return;
        }

        const extension = getFileExtension(preview.blob.type);
        const file = new File([preview.blob], `voice-message-${Date.now()}.${extension}`, {
            type: preview.blob.type,
        });
        onRecorded(file);
        onClose();
    };

    const renderStatus = () => {
        switch (stage) {
            case 'requesting':
                return <span>Requesting microphone…</span>;
            case 'recording':
                return (
                    <>
                        <span className={styles.recordingDot} />
                        <span>Recording…</span>
                    </>
                );
            case 'paused':
                return (
                    <>
                        <span className={styles.pausedDot} />
                        <span>Paused</span>
                    </>
                );
            case 'preview':
                return <span>Preview</span>;
            default:
                return null;
        }
    };

    return (
        <Dialog.Root open onOpenChange={(open) => !open && handleCancel()}>
            <Dialog.Portal>
                <Dialog.Overlay className={dialogStyles.overlay} />
                <Dialog.Content className={dialogStyles.container} aria-describedby={undefined}>
                    <Dialog.Title className={dialogStyles.title}>Voice message</Dialog.Title>
                    {stage === 'error'
                        ? (
                            <>
                                <p className={styles.errorMessage}>
                                    Microphone is not available. Check the browser permissions and try again.
                                </p>
                                <div className={dialogStyles.bottomButtons}>
                                    <Button type="button" onClick={handleCancel}>
                                        Close
                                    </Button>
                                </div>
                            </>
                        )
                        : (
                            <div className={styles.body}>
                                <div className={styles.waveformRow}>
                                    {stage === 'preview' && (
                                        <button
                                            type="button"
                                            className={styles.playButton}
                                            onClick={() => void togglePreviewPlayback()}
                                            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                                        >
                                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                                        </button>
                                    )}
                                    <canvas className={styles.waveformCanvas} ref={canvasRef} />
                                </div>
                                <div className={styles.timer}>
                                    {stage === 'preview'
                                        ? `${formatTime(currentTime)} / ${formatTime(elapsedMs / 1000)}`
                                        : formatTime(elapsedMs / 1000)}
                                </div>
                                <div className={styles.statusRow}>
                                    {renderStatus()}
                                </div>
                                {preview && (
                                    <audio
                                        ref={audioRef}
                                        src={preview.url}
                                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                                        onEnded={() => {
                                            setIsPlaying(false);
                                            setCurrentTime(0);
                                        }}
                                    />
                                )}
                                <div className={dialogStyles.bottomButtons}>
                                    <Button type="button" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                    {stage === 'recording' && (
                                        <Button type="button" onClick={pause}>
                                            <Pause size={16} className={styles.buttonIcon} />
                                            Pause
                                        </Button>
                                    )}
                                    {stage === 'paused' && (
                                        <Button type="button" onClick={resume}>
                                            <Mic size={16} className={styles.buttonIcon} />
                                            Resume
                                        </Button>
                                    )}
                                    {(stage === 'recording' || stage === 'paused') && (
                                        <Button type="button" onClick={stop}>
                                            <Square size={16} className={styles.buttonIcon} />
                                            Stop
                                        </Button>
                                    )}
                                    {stage === 'preview' && (
                                        <>
                                            <Button type="button" onClick={() => void startRecording()}>
                                                <RotateCcw size={16} className={styles.buttonIcon} />
                                                Re-record
                                            </Button>
                                            <Button type="button" onClick={handleAccept}>
                                                Add to message
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
