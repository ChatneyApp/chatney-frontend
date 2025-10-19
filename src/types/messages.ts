export type MessageId = string;
export type MessageUser = {
    id: string;
    name: string;
    avatarUrl: string;
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
