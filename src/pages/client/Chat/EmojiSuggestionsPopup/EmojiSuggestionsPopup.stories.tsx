import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { EmojiSuggestionsPopup } from './EmojiSuggestionsPopup';

/** Mimics the real anchor: a positioned, fixed-width container (like MessageInput's `.inputWrapper`) with a given amount of room above/below it. */
const withAnchorRoom = (paddingTop: number, paddingBottom: number): Decorator => (Story) => (
    <div style={{ paddingTop, paddingBottom }}>
        <div style={{ position: 'relative', width: 320 }}>
            <Story />
        </div>
    </div>
);

const meta: Meta<typeof EmojiSuggestionsPopup> = {
    title: 'pages/client/Chat/EmojiSuggestionsPopup',
    component: EmojiSuggestionsPopup,
};
export default meta;

type Story = StoryObj<typeof EmojiSuggestionsPopup>;

/** Suggestions matching a partial `:sm` query, with plenty of room above the anchor — the popup renders above it, as in the real chat composer. */
export const Default: Story = {
    decorators: [withAnchorRoom(320, 0)],
    args: {
        query: 'sm',
        onSelect: action('onSelect'),
    },
};

/** Same query, but with no room above the anchor — Radix's collision detection flips the popup to render below instead of clipping. */
export const FlipsBelowWhenNoRoomAbove: Story = {
    decorators: [withAnchorRoom(0, 320)],
    args: {
        query: 'sm',
        onSelect: action('onSelect'),
    },
};

/** No query typed yet — the popup renders nothing. */
export const NoQuery: Story = {
    decorators: [withAnchorRoom(200, 0)],
    args: {
        query: null,
        onSelect: action('onSelect'),
    },
};

/** A query with no matching emoji also renders nothing. */
export const NoMatches: Story = {
    decorators: [withAnchorRoom(200, 0)],
    args: {
        query: 'zzzzz',
        onSelect: action('onSelect'),
    },
};
