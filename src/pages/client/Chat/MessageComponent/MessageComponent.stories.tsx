import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { MessageComponent } from './MessageComponent';
import {
    mockEditedMessage,
    mockMessageWithAttachment,
    mockMessageWithReactions,
    mockOwnMessage,
    mockPlainMessage,
    mockReplyMessage,
    mockReplyToMessage,
    mockThreadedMessage,
} from '@/test-utils/fixtures/messages';
import { mockUserId1 } from '@/test-utils/fixtures/users';

const meta: Meta<typeof MessageComponent> = {
    title: 'pages/client/Chat/MessageComponent',
    component: MessageComponent,
};
export default meta;

type Story = StoryObj<typeof MessageComponent>;

const callbacks = {
    onDelete: action('onDelete'),
    onReply: action('onReply'),
    onEdit: action('onEdit'),
    onAddReaction: action('onAddReaction'),
    onDeleteReaction: action('onDeleteReaction'),
    onOpenThread: action('onOpenThread'),
};

/** A plain text message from another user. */
export const Default: Story = {
    args: {
        message: mockPlainMessage,
        currentUserId: mockUserId1,
        ...callbacks,
    },
};

/** A message sent by the current user, styled as "mine". */
export const OwnMessage: Story = {
    args: {
        message: mockOwnMessage,
        currentUserId: mockOwnMessage.userId,
        ...callbacks,
    },
};

/** A message carrying an image attachment. */
export const WithAttachment: Story = {
    args: {
        message: mockMessageWithAttachment,
        currentUserId: mockUserId1,
        ...callbacks,
    },
};

/** A message with existing emoji reactions, one of which belongs to the current user. */
export const WithReactions: Story = {
    args: {
        message: mockMessageWithReactions,
        currentUserId: mockUserId1,
        ...callbacks,
    },
};

/** A message that has been edited after being sent. */
export const Edited: Story = {
    args: {
        message: mockEditedMessage,
        currentUserId: mockUserId1,
        ...callbacks,
    },
};

/** A thread root message showing the reply count button. */
export const WithThread: Story = {
    args: {
        message: mockThreadedMessage,
        currentUserId: mockUserId1,
        ...callbacks,
    },
};

/** A message shown as a reply, quoting the message it replies to. */
export const AsReply: Story = {
    args: {
        message: mockReplyMessage,
        currentUserId: mockUserId1,
        replyRef: mockReplyToMessage,
        ...callbacks,
    },
};
