import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { MessageReaction } from './MessageReaction';

const meta: Meta<typeof MessageReaction> = {
    title: 'pages/client/Chat/MessageReaction',
    component: MessageReaction,
};
export default meta;

type Story = StoryObj<typeof MessageReaction>;

/** A reaction the current user hasn't added. */
export const Default: Story = {
    args: {
        reaction: { code: 'thumbs_up', count: 3 },
        isMine: false,
        onAddReaction: action('onAddReaction'),
        onDeleteReaction: action('onDeleteReaction'),
    },
};

/** A reaction the current user has already added, shown highlighted. */
export const Mine: Story = {
    args: {
        reaction: { code: 'heart', count: 1 },
        isMine: true,
        onAddReaction: action('onAddReaction'),
        onDeleteReaction: action('onDeleteReaction'),
    },
};
