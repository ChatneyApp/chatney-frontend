import { MessageWithUser, Reaction, ReplyToMessage, UrlPreview } from '@/types/messages';
import { mockChannel1 } from './channels';
import { mockMessageUser1, mockMessageUser2, mockUserId1, mockUserId2 } from './users';
import { mockImageAttachment } from './attachments';

const createdAt = new Date('2026-01-15T10:00:00Z');
const updatedAt = createdAt;

export const mockReactions: Reaction[] = [
    { code: 'thumbs_up', count: 3 },
    { code: 'heart', count: 1 },
    { code: 'joy', count: 0 },
];

export const mockUrlPreview: UrlPreview = {
    id: 'preview-1',
    createdAt,
    updatedAt,
    url: 'https://storybook.js.org',
    title: 'Storybook: Frontend workshop for UI development',
    description: 'Storybook is a frontend workshop for building UI components and pages in isolation.',
    thumbnailUrl: 'https://picsum.photos/id/180/400/210',
    videoThumbnailUrl: null,
    siteName: 'Storybook',
    favIconUrl: 'https://storybook.js.org/favicon.ico',
    type: 'website',
    author: null,
    thumbnailWidth: 400,
    thumbnailHeight: 210,
};

export const mockReplyToMessage: ReplyToMessage = {
    id: 100,
    userId: mockUserId2,
    content: 'Can someone double-check the deploy checklist?',
};

export const mockPlainMessage: MessageWithUser = {
    id: 1,
    channelId: mockChannel1.id,
    userId: mockUserId1,
    content: 'Hey team, the new build is looking great!',
    attachments: [],
    status: 'sent',
    createdAt,
    updatedAt,
    reactions: [],
    myReactions: [],
    urlPreviews: [],
    parentId: null,
    childrenCount: 0,
    replyTo: null,
    user: mockMessageUser1,
};

export const mockOwnMessage: MessageWithUser = {
    ...mockPlainMessage,
    id: 2,
    userId: mockUserId2,
    user: mockMessageUser2,
    content: 'Agreed — shipping it today.',
};

export const mockMessageWithReactions: MessageWithUser = {
    ...mockPlainMessage,
    id: 3,
    content: 'Who wants to grab lunch?',
    reactions: mockReactions,
    myReactions: ['thumbs_up'],
};

export const mockMessageWithAttachment: MessageWithUser = {
    ...mockPlainMessage,
    id: 4,
    content: 'Here is the sunset shot from yesterday.',
    attachments: [mockImageAttachment],
};

export const mockMessageWithUrlPreview: MessageWithUser = {
    ...mockPlainMessage,
    id: 5,
    content: 'Check this out: https://storybook.js.org',
    urlPreviews: [mockUrlPreview],
};

export const mockEditedMessage: MessageWithUser = {
    ...mockPlainMessage,
    id: 6,
    content: 'Fixed a typo in this message.',
    updatedAt: new Date('2026-01-15T10:05:00Z'),
};

export const mockThreadedMessage: MessageWithUser = {
    ...mockPlainMessage,
    id: 7,
    content: 'Kicking off a thread here — thoughts?',
    childrenCount: 4,
};

export const mockReplyMessage: MessageWithUser = {
    ...mockPlainMessage,
    id: 8,
    content: 'Sounds good to me.',
    replyTo: mockReplyToMessage.id,
};

export const mockMultilineMessage: MessageWithUser = {
    ...mockPlainMessage,
    id: 9,
    content: 'Line one of the update.\nLine two with more detail.\n\nLine four after a blank line.',
};
