import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
    title: 'pages/client/Chat/ProgressBar',
    component: ProgressBar,
};
export default meta;

type Story = StoryObj<typeof ProgressBar>;

/** A progress bar partway through an upload. */
export const Default: Story = {
    args: {
        label: 'uploading-video.mp4',
        progress: 0.45,
    },
};

/** A freshly started upload. */
export const JustStarted: Story = {
    args: {
        label: 'photo.jpg',
        progress: 0,
    },
};

/** A completed upload. */
export const Complete: Story = {
    args: {
        label: 'document.pdf',
        progress: 1,
    },
};
