import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageAttachmentComponent } from './MessageAttachmentComponent';
import {
    mockAudioAttachment,
    mockBinaryAttachment,
    mockGifAttachment,
    mockImageAttachment,
    mockVideoAttachment,
} from '@/test-utils/fixtures/attachments';

/**
 * The component builds its display URL from `attachment.urlPath` via a hardcoded
 * `http://localhost:9000/chatney/...` base (see STORYBOOK_COVERAGE.md caveats). Storybook's
 * MSW handler (src/test-utils/mocks/attachmentUrlHandlers.ts) intercepts that specific host and
 * serves real sample bytes matched by file extension, so previews render normally here.
 */
const meta: Meta<typeof MessageAttachmentComponent> = {
    title: 'pages/client/Chat/MessageAttachmentComponent',
    component: MessageAttachmentComponent,
};
export default meta;

type Story = StoryObj<typeof MessageAttachmentComponent>;

/** An image attachment, rendered as a clickable thumbnail. */
export const Image: Story = {
    args: {
        attachment: mockImageAttachment,
    },
};

/** An animated GIF attachment. */
export const Gif: Story = {
    args: {
        attachment: mockGifAttachment,
    },
};

/** A video attachment. */
export const Video: Story = {
    args: {
        attachment: mockVideoAttachment,
    },
};

/** An audio attachment, rendered with a waveform player. */
export const Audio: Story = {
    args: {
        attachment: mockAudioAttachment,
    },
};

/** A generic binary file, rendered as a download link with a file-type icon. */
export const Binary: Story = {
    args: {
        attachment: mockBinaryAttachment,
    },
};
