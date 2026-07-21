import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { VideoRecorderModal } from './VideoRecorderModal';
import { withFakeMediaDevices } from '@/test-utils/decorators/withFakeMediaDevices';

/**
 * Uses a synthetic (canvas-captured) video MediaStream in place of a real camera, so the
 * recording/pause/preview flow is genuinely exercised via the browser's real MediaRecorder — see
 * src/test-utils/decorators/withFakeMediaDevices.tsx. Requires a browser that supports
 * HTMLCanvasElement.captureStream (all evergreen browsers).
 */
const meta: Meta<typeof VideoRecorderModal> = {
    title: 'pages/client/Chat/VideoRecorderModal',
    component: VideoRecorderModal,
};
export default meta;

type Story = StoryObj<typeof VideoRecorderModal>;

/** A live recording session using a synthetic camera stream. */
export const Recording: Story = {
    decorators: [withFakeMediaDevices('video')],
    args: {
        onClose: action('onClose'),
        onRecorded: action('onRecorded'),
    },
};

/** The camera permission was denied or is unavailable. */
export const PermissionDenied: Story = {
    decorators: [withFakeMediaDevices('deny')],
    args: {
        onClose: action('onClose'),
        onRecorded: action('onRecorded'),
    },
};
