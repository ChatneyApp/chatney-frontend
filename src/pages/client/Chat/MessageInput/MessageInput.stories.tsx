import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { MessageInput } from './MessageInput';
import { mockImageAttachment } from '@/test-utils/fixtures/attachments';
import { mockOwnMessage } from '@/test-utils/fixtures/messages';

/**
 * Only baseline states are covered (empty, editing, replying). MessageInput's voice/video
 * recorder buttons and drag-and-drop upload flow trigger real `getUserMedia`/`MediaRecorder`/XHR
 * side effects in its children and aren't exercised here — see STORYBOOK_COVERAGE.md.
 */
const meta: Meta<typeof MessageInput> = {
    title: 'pages/client/Chat/MessageInput',
    component: MessageInput,
};
export default meta;

type Story = StoryObj<typeof MessageInput>;

/** An empty composer, ready for a new message. */
export const Default: Story = {
    args: {
        onSend: action('onSend'),
    },
};

/** Editing an existing message with an attachment already attached. */
export const Editing: Story = {
    args: {
        editingMessage: { id: 1, content: 'Original text before the edit', attachments: [mockImageAttachment] },
        onSend: action('onSend'),
        onSaveEdit: action('onSaveEdit'),
        onCancelEdit: action('onCancelEdit'),
    },
};

/** Composing a reply, with the quoted message shown above the input. */
export const Replying: Story = {
    args: {
        replyToMessage: mockOwnMessage,
        onSend: action('onSend'),
        onClearReply: action('onClearReply'),
    },
};

/**
 * Editing a message while a reply is also pending. In real usage (ChatMessageList.tsx),
 * `editingMessage` and `replyToMessage` are independent pieces of state — e.g. you start
 * replying to one message, then click edit on a different message before sending. The component
 * gives editing priority: the reply quote is hidden and only the edit banner shows, even though
 * `replyToMessage` is still set underneath and will reappear once editing is cancelled.
 */
export const EditingWithPendingReply: Story = {
    args: {
        editingMessage: { id: 1, content: 'Original text before the edit', attachments: [] },
        replyToMessage: mockOwnMessage,
        onSend: action('onSend'),
        onSaveEdit: action('onSaveEdit'),
        onCancelEdit: action('onCancelEdit'),
        onClearReply: action('onClearReply'),
    },
};
