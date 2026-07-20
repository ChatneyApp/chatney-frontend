import { useCallback, useEffect, useRef, useState } from 'react';

export type RecordingStage = 'requesting' | 'recording' | 'paused' | 'preview' | 'error';

export type RecordingPreview = {
    blob: Blob;
    url: string;
};

type Options = {
    constraints: MediaStreamConstraints;
    mimeCandidates: string[];
    fallbackMimeType: string;
    // called once the stream is live; the returned cleanup runs when the session is released
    onStream?: (stream: MediaStream) => (() => void) | void;
};

type RecordingSession = {
    stream: MediaStream;
    recorder: MediaRecorder;
    chunks: Blob[];
    finished: boolean;
    released: boolean;
    streamCleanup?: () => void;
};

export function useRecordingSession(options: Options) {
    const [stage, setStage] = useState<RecordingStage>('requesting');
    const [elapsedMs, setElapsedMs] = useState(0);
    const [preview, setPreview] = useState<RecordingPreview | null>(null);

    const optionsRef = useRef(options);
    optionsRef.current = options;

    const sessionRef = useRef<RecordingSession | null>(null);
    const previewUrlRef = useRef<string | null>(null);
    const isMountedRef = useRef(true);
    const accumulatedMsRef = useRef(0);
    const segmentStartRef = useRef(0);

    const releaseSession = useCallback((session: RecordingSession) => {
        if (session.released) {
            return;
        }

        session.released = true;
        session.streamCleanup?.();
        session.stream.getTracks().forEach(track => track.stop());
    }, []);

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

    const startRecording = useCallback(async () => {
        stopSession(true);
        setStage('requesting');
        setPreview(null);
        setElapsedMs(0);
        accumulatedMsRef.current = 0;

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }

        const { constraints, mimeCandidates, fallbackMimeType, onStream } = optionsRef.current;

        let stream: MediaStream;
        try {
            if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
                throw new Error('Media recording is not supported');
            }
            stream = await navigator.mediaDevices.getUserMedia(constraints);
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

        const mimeType = mimeCandidates.find(type => MediaRecorder.isTypeSupported(type));
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
        const session: RecordingSession = {
            stream,
            recorder,
            chunks: [],
            finished: false,
            released: false,
        };
        session.streamCleanup = onStream?.(stream) ?? undefined;

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

            const blob = new Blob(session.chunks, { type: recorder.mimeType || mimeType || fallbackMimeType });
            const url = URL.createObjectURL(blob);
            previewUrlRef.current = url;
            setPreview({ blob, url });
            setStage('preview');
        };

        sessionRef.current = session;
        segmentStartRef.current = performance.now();
        recorder.start(250);
        setStage('recording');
    }, [releaseSession, stopSession]);

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

    const pause = useCallback(() => {
        const session = sessionRef.current;
        if (!session || session.recorder.state !== 'recording') {
            return;
        }

        accumulatedMsRef.current += performance.now() - segmentStartRef.current;
        setElapsedMs(accumulatedMsRef.current);
        session.recorder.pause();
        setStage('paused');
    }, []);

    const resume = useCallback(() => {
        const session = sessionRef.current;
        if (!session || session.recorder.state !== 'paused') {
            return;
        }

        segmentStartRef.current = performance.now();
        session.recorder.resume();
        setStage('recording');
    }, []);

    const stop = useCallback(() => {
        stopSession(false);
    }, [stopSession]);

    const cancel = useCallback(() => {
        stopSession(true);
    }, [stopSession]);

    return { stage, elapsedMs, preview, startRecording, pause, resume, stop, cancel };
}
