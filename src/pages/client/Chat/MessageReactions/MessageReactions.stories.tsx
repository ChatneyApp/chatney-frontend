import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { MessageReactions } from './MessageReactions';
import { mockReactions } from '@/test-utils/fixtures/messages';

const meta: Meta<typeof MessageReactions> = {
    title: 'pages/client/Chat/MessageReactions',
    component: MessageReactions,
};
export default meta;

type Story = StoryObj<typeof MessageReactions>;

/** A mix of reactions, one of which belongs to the current user, plus the "add reaction" trigger. */
export const Default: Story = {
    args: {
        reactions: mockReactions,
        myReactions: ['thumbs_up'],
        onAddReaction: action('onAddReaction'),
        onDeleteReaction: action('onDeleteReaction'),
    },
};

/** No reactions yet — only the "add reaction" trigger is shown. */
export const Empty: Story = {
    args: {
        reactions: [],
        myReactions: [],
        onAddReaction: action('onAddReaction'),
        onDeleteReaction: action('onDeleteReaction'),
    },
};
