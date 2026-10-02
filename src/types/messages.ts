import type { MessageFieldsFragment, MessagesResultFieldsFragment, UrlPreviewFieldsFragment } from '@/graphql/generated/graphql';
import { AttachmentId } from '@/types/attachments';

export type MessageId = number;
export type UrlPreviewId = number;
export type MessageWithUser = MessageFieldsFragment;
export type MessageUser = MessageWithUser['user'];
export type Message = Omit<MessageWithUser, 'user'>;
export type UrlPreview = UrlPreviewFieldsFragment;
export type Reaction = MessageWithUser['reactions'][number];
export type MessagesResult = MessagesResultFieldsFragment;
export type ReplyToMessage = MessagesResult['refs'][number];

export type CreateMessageDto = Pick<Message, 'channelId' | 'content' | 'parentId' | 'replyTo'> & {
    attachmentIds: AttachmentId[];
};

export type UpdateMessageDto = {
    id: MessageId;
    content: string;
    attachmentIds: AttachmentId[];
};

export type CreateMessageInput = Omit<Message,
    'id'
    | 'createdAt'
    | 'updatedAt'
    | 'status'
    | 'reactions'
    | 'urlPreviews'
    | 'childrenCount'
    | 'myReactions'
>;
