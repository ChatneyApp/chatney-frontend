import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageUrlPreviewComponent } from './MessageUrlPreviewComponent';
import { mockUrlPreview } from '@/test-utils/fixtures/messages';

const meta: Meta<typeof MessageUrlPreviewComponent> = {
    title: 'pages/client/Chat/MessageUrlPreviewComponent',
    component: MessageUrlPreviewComponent,
};
export default meta;

type Story = StoryObj<typeof MessageUrlPreviewComponent>;

/** A full preview with site name, title, description and thumbnail. */
export const Default: Story = {
    args: {
        preview: mockUrlPreview,
    },
};

/** A minimal preview with only a title — description and thumbnail omitted. */
export const TitleOnly: Story = {
    args: {
        preview: {
            ...mockUrlPreview,
            description: null,
            thumbnailUrl: null,
            siteName: null,
        },
    },
};
