import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageUrlPreviewsComponent } from './MessageUrlPreviewsComponent';
import { mockUrlPreview } from '@/test-utils/fixtures/messages';

const meta: Meta<typeof MessageUrlPreviewsComponent> = {
    title: 'pages/client/Chat/MessageUrlPreviewsComponent',
    component: MessageUrlPreviewsComponent,
};
export default meta;

type Story = StoryObj<typeof MessageUrlPreviewsComponent>;

/** A single link preview with a thumbnail, title and description. */
export const Default: Story = {
    args: {
        urlPreviews: [mockUrlPreview],
    },
};

/** No previews — renders nothing. */
export const Empty: Story = {
    args: {
        urlPreviews: [],
    },
};
