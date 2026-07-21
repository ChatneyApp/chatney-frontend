import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { FullscreenPreview } from './FullscreenPreview';
import { samplePlaceholderImageUrl, samplePlaceholderVideoUrl } from '@/test-utils/fixtures/attachments';

const meta: Meta<typeof FullscreenPreview> = {
    title: 'pages/client/Chat/FullscreenPreview',
    component: FullscreenPreview,
};
export default meta;

type Story = StoryObj<typeof FullscreenPreview>;

/** Fullscreen overlay showing an image. */
export const Image: Story = {
    args: {
        attachmentType: 'image',
        attachmentUrl: samplePlaceholderImageUrl,
        fileName: 'sunset.jpg',
        onClose: action('onClose'),
    },
};

/** Fullscreen overlay showing a playable video. */
export const Video: Story = {
    args: {
        attachmentType: 'video',
        attachmentUrl: samplePlaceholderVideoUrl,
        fileName: 'demo.mp4',
        onClose: action('onClose'),
    },
};
