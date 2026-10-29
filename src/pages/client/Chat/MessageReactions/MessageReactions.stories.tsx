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
        canAddReaction: true,
        canRemoveReaction: true,
        onAddReaction: action('onAddReaction'),
        onDeleteReaction: action('onDeleteReaction'),
    },
};

/** No reactions yet — only the "add reaction" trigger is shown. */
export const Empty: Story = {
    args: {
        reactions: [],
        myReactions: [],
        canAddReaction: true,
        canRemoveReaction: true,
        onAddReaction: action('onAddReaction'),
        onDeleteReaction: action('onDeleteReaction'),
    },
};

/** The current user can add reactions but not remove them: their own reaction can't be clicked. */
export const WithoutRemovePermission: Story = {
    args: {
        reactions: mockReactions,
        myReactions: ['thumbs_up'],
        canAddReaction: true,
        canRemoveReaction: false,
        onAddReaction: action('onAddReaction'),
        onDeleteReaction: action('onDeleteReaction'),
    },
};

/** The current user can remove reactions but not add them: no "add reaction" trigger, and others' reactions can't be clicked. */
export const WithoutAddPermission: Story = {
    args: {
        reactions: mockReactions,
        myReactions: ['thumbs_up'],
        canAddReaction: false,
        canRemoveReaction: true,
        onAddReaction: action('onAddReaction'),
        onDeleteReaction: action('onDeleteReaction'),
    },
};
