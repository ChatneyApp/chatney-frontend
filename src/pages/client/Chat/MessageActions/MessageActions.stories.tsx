import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { MessageActions } from './MessageActions';

const meta: Meta<typeof MessageActions> = {
    title: 'pages/client/Chat/MessageActions',
    component: MessageActions,
    args: {
        canReply: true,
        canEdit: true,
        canDelete: true,
        onReply: action('onReply'),
        onEdit: action('onEdit'),
        onDelete: action('onDelete'),
    },
};
export default meta;

type Story = StoryObj<typeof MessageActions>;

/** All three actions: reply, edit and delete. */
export const Default: Story = {};

/** Someone else's message without moderation permissions: only reply. */
export const ReplyOnly: Story = {
    args: {
        canEdit: false,
        canDelete: false,
    },
};

/** A read-only channel where the user can still delete: only delete. */
export const DeleteOnly: Story = {
    args: {
        canReply: false,
        canEdit: false,
    },
};
