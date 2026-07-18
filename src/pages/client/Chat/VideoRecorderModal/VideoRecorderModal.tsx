import { useRef } from 'react';
import { Pause, RotateCcw, Square, Video } from 'lucide-react';
import { Dialog } from 'radix-ui';

import { Button } from '@/components/Button';
import { useRecordingSession } from '@/hooks/useRecordingSession';
import { formatTime } from '@/helpers/audio/waveform';

import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './VideoRecorderModal.module.css';

type Props = {
    onClose: () => void;
    onRecorded: (file: File) => void;
};

const MIME_CANDIDATES = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
];

const FILE_EXTENSIONS: Record<string, string> = {
    'video/webm': 'webm',
    'video/mp4': 'mp4',
};

const getFileExtension = (mimeType: string) => {
    const baseMimeType = mimeType.split(';')[0].trim().toLowerCase();

    return FILE_EXTENSIONS[baseMimeType] ?? 'webm';
};

export function VideoRecorderModal({ onClose, onRecorded }: Props) {
    const liveVideoRef = useRef<HTMLVideoElement | null>(null);

    const { stage, elapsedMs, preview, startRecording, pause, resume, stop, cancel } = useRecordingSession({
        constraints: {
            video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
            audio: true,
        },
        mimeCandidates: MIME_CANDIDATES,
        fallbackMimeType: 'video/webm',
        onStream: (stream) => {
            if (liveVideoRef.current) {
                liveVideoRef.current.srcObject = stream;
            }

            return () => {
                if (liveVideoRef.current) {
                    liveVideoRef.current.srcObject = null;
                }
            };
        },
    });

    const handleCancel = () => {
        cancel();
        onClose();
    };

    const handleAccept = () => {
        if (!preview) {
            return;
        }

        const extension = getFileExtension(preview.blob.type);
        const file = new File([preview.blob], `video-message-${Date.now()}.${extension}`, {
            type: preview.blob.type,
        });
        onRecorded(file);
        onClose();
    };

    const renderStatus = () => {
        switch (stage) {
            case 'requesting':
                return <span>Requesting camera…</span>;
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
                <Dialog.Content
                    className={`${dialogStyles.container} ${styles.wideContainer}`}
                    aria-describedby={undefined}
                >
                    <Dialog.Title className={dialogStyles.title}>Video message</Dialog.Title>
                    {stage === 'error'
                        ? (
                            <>
                                <p className={styles.errorMessage}>
                                    Camera is not available. Check the browser permissions and try again.
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
                                <div className={styles.videoBox}>
                                    {stage === 'preview' && preview
                                        ? (
                                            <video
                                                className={styles.video}
                                                src={preview.url}
                                                controls
                                                playsInline
                                            />
                                        )
                                        : (
                                            <video
                                                className={styles.video}
                                                ref={liveVideoRef}
                                                autoPlay
                                                muted
                                                playsInline
                                            />
                                        )}
                                </div>
                                <div className={styles.timer}>
                                    {formatTime(elapsedMs / 1000)}
                                </div>
                                <div className={styles.statusRow}>
                                    {renderStatus()}
                                </div>
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
                                            <Video size={16} className={styles.buttonIcon} />
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
