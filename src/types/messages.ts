import { UserId } from '@/types/users';
import { Attachment, AttachmentId } from '@/types/attachments';
import { ChannelId } from '@/types/channels';

export type MessageId = number;
export type UrlPreviewId = string;
export type MessageUser = {
    id: UserId;
    name: string;
    avatarUrl: string;
}
export type UrlPreview = {
    id: UrlPreviewId;
    createdAt: Date;
    updatedAt: Date;
    url: string;
    title: string | null;
    description: string | null;
    thumbnailUrl: string | null;
    videoThumbnailUrl: string | null;
    siteName: string | null;
    favIconUrl: string | null;
    type: string | null;
    author: string | null;
    thumbnailWidth: number | null;
    thumbnailHeight: number | null;
}
export type Message = {
    id: MessageId;
    channelId: ChannelId;
    userId: UserId;
    content: string;
    attachments: Attachment[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
    reactions: Reaction[];
    myReactions: string[];
    urlPreviews: UrlPreview[];
    parentId: MessageId | null;
    childrenCount: number;
}
export type MessageWithUser = Message & {
    user: MessageUser;
}

export type CreateMessageDto = Pick<Message, 'channelId' | 'content' | 'parentId'> & {
    attachmentIds: AttachmentId[];
};

export type Reaction = {
    code: string;
    count: number;
}

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
