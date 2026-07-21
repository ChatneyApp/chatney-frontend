import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ReactionSelectionDialog } from './ReactionSelectionDialog';
import { ALL_REACTION_CODES } from '@/pages/client/Chat/emojis';

const meta: Meta<typeof ReactionSelectionDialog> = {
    title: 'pages/client/Chat/ReactionSelectionDialog',
    component: ReactionSelectionDialog,
};
export default meta;

type Story = StoryObj<typeof ReactionSelectionDialog>;

/** Click the emoji trigger to open the category/search picker. */
export const Default: Story = {
    args: {
        reactions: ALL_REACTION_CODES,
        myReactions: [],
        onSelect: action('onSelect'),
    },
};

/** A couple of reactions have already been picked, so they're excluded from the list. */
export const WithExistingReactions: Story = {
    args: {
        reactions: ALL_REACTION_CODES,
        myReactions: ['thumbs_up', 'heart'],
        onSelect: action('onSelect'),
    },
};
