import { UserId } from '@/types/users';

export type MessageId = string;
export type UrlPreviewId = string;
export type MessageUser = {
    id: UserId;
    name: string;
    avatarUrl: string;
}
export type UrlPreviewMediaSize = {
    width: number;
    height: number;
}
export type UrlPreview = {
    id: UrlPreviewId;
    createdAt: Date;
    updatedAt: Date;
    url: string;
    title: string | null;
    description: string | null;
    imageUrl: string | null;
    videoUrl: string | null;
    siteName: string | null;
    favIconUrl: string | null;
    type: string | null;
    author: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
    domain: string | null;
}
export type Message = {
    id: MessageId;
    channelId: string;
    userId: string;
    content: string;
    attachments: string[];
    status: string;
    createdAt: Date;
    updatedAt: Date;
    reactions: Reaction[];
    myReactions: string[];
    urlPreviews: UrlPreview[];
    parentId: string | null;
}
export type MessageWithUser = Message & {
    user: MessageUser;
}

export type CreateMessageDto = Pick<Message, 'channelId' | 'content' | 'attachments' | 'parentId'>;

export type Reaction = {
    code: string;
    count: number;
}

export type CreateMessageInput = Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'reactions'>;
