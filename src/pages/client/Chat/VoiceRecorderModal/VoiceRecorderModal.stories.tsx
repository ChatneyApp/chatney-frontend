import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { VoiceRecorderModal } from './VoiceRecorderModal';
import { withFakeMediaDevices } from '@/test-utils/decorators/withFakeMediaDevices';

/**
 * Uses a synthetic (oscillator-generated) audio MediaStream in place of a real microphone, so
 * the recording/pause/preview flow is genuinely exercised via the browser's real MediaRecorder —
 * see src/test-utils/decorators/withFakeMediaDevices.tsx. Requires a browser that supports
 * AudioContext.createMediaStreamDestination (all evergreen browsers).
 */
const meta: Meta<typeof VoiceRecorderModal> = {
    title: 'pages/client/Chat/VoiceRecorderModal',
    component: VoiceRecorderModal,
};
export default meta;

type Story = StoryObj<typeof VoiceRecorderModal>;

/** A live recording session using a synthetic microphone stream. */
export const Recording: Story = {
    decorators: [withFakeMediaDevices('audio')],
    args: {
        onClose: action('onClose'),
        onRecorded: action('onRecorded'),
    },
};

/** The microphone permission was denied or is unavailable. */
export const PermissionDenied: Story = {
    decorators: [withFakeMediaDevices('deny')],
    args: {
        onClose: action('onClose'),
        onRecorded: action('onRecorded'),
    },
};
