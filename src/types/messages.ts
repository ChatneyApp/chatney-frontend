export type MessageId = string;
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

export type CreateMessageDto = Pick<Message, 'channelId' | 'content' | 'attachments' | 'parentId'>;

export type Reaction = {
    userId: string;
    reactionText: string;
}

export type CreateMessageInput = Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'reactions'>;
