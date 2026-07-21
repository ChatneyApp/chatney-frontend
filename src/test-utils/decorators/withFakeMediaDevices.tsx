import { useEffect } from 'react';
import type { Decorator } from '@storybook/react-vite';
import { createFakeAudioStream, createFakeVideoStream } from '@/test-utils/mocks/fakeMediaDevices';

/**
 * Patches navigator.mediaDevices.getUserMedia for the story's lifetime so components using
 * useRecordingSession get a real (synthetic) MediaStream instead of a permission prompt.
 * 'deny' simulates the user rejecting the permission prompt, exercising the error state.
 */
export const withFakeMediaDevices = (kind: 'audio' | 'video' | 'deny'): Decorator => (Story) => {
    useEffect(() => {
        if (!navigator.mediaDevices) {
            return;
        }
        const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);

        navigator.mediaDevices.getUserMedia = async () => {
            if (kind === 'deny') {
                throw new DOMException('Permission denied', 'NotAllowedError');
            }
            return kind === 'audio' ? createFakeAudioStream() : createFakeVideoStream();
        };

        return () => {
            navigator.mediaDevices.getUserMedia = original;
        };
    }, []);

    return <Story />;
};
