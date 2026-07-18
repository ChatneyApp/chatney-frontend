import { useCallback, useEffect, useRef, useState } from 'react';
import { Mic, Pause, Play, RotateCcw, Square } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { Button } from '@/components/Button';
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

type Stage = 'requesting' | 'recording' | 'paused' | 'preview' | 'error';

type RecordingSession = {
    stream: MediaStream;
    recorder: MediaRecorder;
    audioContext: AudioContext;
    analyser: AnalyserNode;
    chunks: Blob[];
    finished: boolean;
    released: boolean;
};

type Preview = {
    blob: Blob;
    url: string;
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

const pickMimeType = () => MIME_CANDIDATES.find(type => MediaRecorder.isTypeSupported(type));

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
    const [stage, setStage] = useState<Stage>('requesting');
    const [elapsedMs, setElapsedMs] = useState(0);
    const [preview, setPreview] = useState<Preview | null>(null);
    const [previewWaveform, setPreviewWaveform] = useState(EMPTY_WAVEFORM);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const sessionRef = useRef<RecordingSession | null>(null);
    const previewUrlRef = useRef<string | null>(null);
    const isMountedRef = useRef(true);
    const liveBarsRef = useRef<number[]>([]);
    const accumulatedMsRef = useRef(0);
    const segmentStartRef = useRef(0);

    const releaseSession = useCallback((session: RecordingSession) => {
        if (session.released) {
            return;
        }

        session.released = true;
        session.stream.getTracks().forEach(track => track.stop());
        void session.audioContext.close().catch(() => undefined);
    }, []);

    const startRecording = useCallback(async () => {
        setStage('requesting');
        setPreview(null);
        setPreviewWaveform(EMPTY_WAVEFORM);
        setCurrentTime(0);
        setIsPlaying(false);
        setElapsedMs(0);
        liveBarsRef.current = [];
        accumulatedMsRef.current = 0;

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        let stream: MediaStream;
        try {
            if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
                throw new Error('Audio recording is not supported');
            }
            stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch {
            if (isMountedRef.current) {
                setStage('error');
            }
            return;
        }

        if (!isMountedRef.current) {
            stream.getTracks().forEach(track => track.stop());
            return;
        }

        const audioContext = getAudioContext();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        audioContext.createMediaStreamSource(stream).connect(analyser);

        const mimeType = pickMimeType();
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        const session: RecordingSession = {
            stream,
            recorder,
            audioContext,
            analyser,
            chunks: [],
            finished: false,
            released: false,
        };

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                session.chunks.push(event.data);
            }
        };
        recorder.onstop = () => {
            releaseSession(session);
            if (!session.finished || !isMountedRef.current) {
                return;
            }

            const blob = new Blob(session.chunks, { type: recorder.mimeType || mimeType || 'audio/webm' });
            const url = URL.createObjectURL(blob);
            previewUrlRef.current = url;
            setPreview({ blob, url });
            setStage('preview');
        };

        sessionRef.current = session;
        segmentStartRef.current = performance.now();
        recorder.start(250);
        setStage('recording');
    }, [releaseSession]);

    const stopSession = useCallback((discard: boolean) => {
        const session = sessionRef.current;
        if (!session) {
            return;
        }

        sessionRef.current = null;
        session.finished = !discard;
        if (session.recorder.state === 'recording') {
            accumulatedMsRef.current += performance.now() - segmentStartRef.current;
            setElapsedMs(accumulatedMsRef.current);
        }
        if (session.recorder.state !== 'inactive') {
            session.recorder.stop();
        } else {
            releaseSession(session);
        }
    }, [releaseSession]);

    useEffect(() => {
        isMountedRef.current = true;
        void startRecording();

        return () => {
            isMountedRef.current = false;
            stopSession(true);
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
                previewUrlRef.current = null;
            }
        };
    }, [startRecording, stopSession]);

    // live scrolling waveform while recording
    useEffect(() => {
        const session = sessionRef.current;
        if (stage !== 'recording' || !session) {
            return;
        }

        const data = new Uint8Array(session.analyser.fftSize);
        let peakHold = 0;
        let lastBarAt = performance.now();
        let rafId = 0;

        const tick = () => {
            session.analyser.getByteTimeDomainData(data);
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

    // elapsed-time ticker while recording
    useEffect(() => {
        if (stage !== 'recording') {
            return;
        }

        const intervalId = setInterval(() => {
            setElapsedMs(accumulatedMsRef.current + (performance.now() - segmentStartRef.current));
        }, 200);

        return () => clearInterval(intervalId);
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

    const handlePause = () => {
        const session = sessionRef.current;
        if (!session || session.recorder.state !== 'recording') {
            return;
        }

        accumulatedMsRef.current += performance.now() - segmentStartRef.current;
        setElapsedMs(accumulatedMsRef.current);
        session.recorder.pause();
        setStage('paused');
    };

    const handleResume = () => {
        const session = sessionRef.current;
        if (!session || session.recorder.state !== 'paused') {
            return;
        }

        segmentStartRef.current = performance.now();
        session.recorder.resume();
        setStage('recording');
    };

    const handleStop = () => {
        stopSession(false);
    };

    const handleCancel = () => {
        stopSession(true);
        onClose();
    };

    const handleRerecord = () => {
        void startRecording();
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
                                        <Button type="button" onClick={handlePause}>
                                            <Pause size={16} className={styles.buttonIcon} />
                                            Pause
                                        </Button>
                                    )}
                                    {stage === 'paused' && (
                                        <Button type="button" onClick={handleResume}>
                                            <Mic size={16} className={styles.buttonIcon} />
                                            Resume
                                        </Button>
                                    )}
                                    {(stage === 'recording' || stage === 'paused') && (
                                        <Button type="button" onClick={handleStop}>
                                            <Square size={16} className={styles.buttonIcon} />
                                            Stop
                                        </Button>
                                    )}
                                    {stage === 'preview' && (
                                        <>
                                            <Button type="button" onClick={handleRerecord}>
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
