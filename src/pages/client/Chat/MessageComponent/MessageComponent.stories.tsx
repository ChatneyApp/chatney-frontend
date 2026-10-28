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
    args: {
        canCreateThread: true,
    },
};
export default meta;

type Story = StoryObj<typeof MessageComponent>;

const reactionPermissions = {
    canAddReaction: true,
    canRemoveReaction: true,
};

const callbacks = {
    onDelete: action('onDelete'),
    onReply: action('onReply'),
    onEdit: action('onEdit'),
    onAddReaction: action('onAddReaction'),
    onDeleteReaction: action('onDeleteReaction'),
    onOpenThread: action('onOpenThread'),
};

/** A plain text message from another user, without permission to delete others' messages. */
export const Default: Story = {
    args: {
        message: mockPlainMessage,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: false,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A message sent by the current user, styled as "mine", with edit and delete buttons. */
export const OwnMessage: Story = {
    args: {
        message: mockOwnMessage,
        currentUserId: mockOwnMessage.userId,
        canReply: true,
        canEdit: true,
        canDelete: true,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A message carrying an image attachment. */
export const WithAttachment: Story = {
    args: {
        message: mockMessageWithAttachment,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: false,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A message with existing emoji reactions, one of which belongs to the current user. */
export const WithReactions: Story = {
    args: {
        message: mockMessageWithReactions,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: false,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A message that has been edited after being sent. */
export const Edited: Story = {
    args: {
        message: mockEditedMessage,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: false,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A thread root message showing the reply count button. */
export const WithThread: Story = {
    args: {
        message: mockThreadedMessage,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: false,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A message shown as a reply, quoting the message it replies to. */
export const AsReply: Story = {
    args: {
        message: mockReplyMessage,
        currentUserId: mockUserId1,
        replyRef: mockReplyToMessage,
        canReply: true,
        canEdit: false,
        canDelete: false,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** The current user's message in a channel where they can't edit their own messages: no edit button. */
export const OwnMessageWithoutEditPermission: Story = {
    args: {
        message: mockOwnMessage,
        currentUserId: mockOwnMessage.userId,
        canReply: true,
        canEdit: false,
        canDelete: true,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** Another user's message when the current user can delete anyone's messages. */
export const OthersMessageWithDeleteAnyPermission: Story = {
    args: {
        message: mockPlainMessage,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: true,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A message in a channel where the current user can't post: no reply, edit or delete buttons. */
export const WithoutPostPermission: Story = {
    args: {
        message: mockPlainMessage,
        currentUserId: mockUserId1,
        canReply: false,
        canEdit: false,
        canDelete: false,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A message with reactions in a channel where the current user can't add or remove reactions: no "add reaction" trigger, and the reactions can't be clicked. */
export const WithoutReactionPermissions: Story = {
    args: {
        message: mockMessageWithReactions,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: false,
        canAddReaction: false,
        canRemoveReaction: false,
        ...callbacks,
    },
};

/** A message without replies in a channel where the current user can't start threads: no thread button. */
export const WithoutThreadPermission: Story = {
    args: {
        message: mockPlainMessage,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: false,
        canCreateThread: false,
        ...reactionPermissions,
        ...callbacks,
    },
};

/** A thread root message in a channel where the current user can't start threads: the thread button stays so the replies can be read. */
export const WithThreadWithoutThreadPermission: Story = {
    args: {
        message: mockThreadedMessage,
        currentUserId: mockUserId1,
        canReply: true,
        canEdit: false,
        canDelete: false,
        canCreateThread: false,
        ...reactionPermissions,
        ...callbacks,
    },
};
