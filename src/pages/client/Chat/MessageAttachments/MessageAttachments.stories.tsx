import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageAttachments } from './MessageAttachments';
import { mockBinaryAttachment, mockImageAttachment } from '@/test-utils/fixtures/attachments';

const meta: Meta<typeof MessageAttachments> = {
    title: 'pages/client/Chat/MessageAttachments',
    component: MessageAttachments,
};
export default meta;

type Story = StoryObj<typeof MessageAttachments>;

/** A single image attachment. */
export const Default: Story = {
    args: {
        attachments: [mockImageAttachment],
    },
};

/** Multiple attachments of different kinds rendered together. */
export const Multiple: Story = {
    args: {
        attachments: [mockImageAttachment, mockBinaryAttachment],
    },
};

/** No attachments — renders nothing. */
export const Empty: Story = {
    args: {
        attachments: [],
    },
};
