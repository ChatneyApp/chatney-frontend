import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { MessageThreadButton } from './MessageThreadButton';

const meta: Meta<typeof MessageThreadButton> = {
    title: 'pages/client/Chat/MessageThreadButton',
    component: MessageThreadButton,
};
export default meta;

type Story = StoryObj<typeof MessageThreadButton>;

/** A thread button with a few replies. */
export const Default: Story = {
    args: {
        count: 3,
        onToggleThread: action('onToggleThread'),
    },
};

/** A thread with no replies yet. */
export const NoReplies: Story = {
    args: {
        count: 0,
        onToggleThread: action('onToggleThread'),
    },
};

/** A heavily-discussed thread. */
export const ManyReplies: Story = {
    args: {
        count: 128,
        onToggleThread: action('onToggleThread'),
    },
};
