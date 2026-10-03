import { ApolloClient } from '@apollo/client';

import { graphql } from '@/graphql/generated';
import { CreateMessageDto, MessageId, MessagesResult, MessageWithUser, UpdateMessageDto } from '@/types/messages';
import { ChannelId } from '@/types/channels';

export const UrlPreviewFieldsFragment = graphql(`
    fragment UrlPreviewFields on UrlPreview {
        id
        createdAt
        updatedAt
        url
        title
        description
        thumbnailUrl
        videoThumbnailUrl
        siteName
        favIconUrl
        type
        author
        thumbnailWidth
        thumbnailHeight
    }
`);

export const MessageFieldsFragment = graphql(`
    fragment MessageFields on MessageWithUser {
        id
        channelId
        userId
        user {
            id
            nickname
            fullName
            displayName
            avatarUrl
        }
        content
        attachments {
            ...AttachmentFields
        }
        status
        createdAt
        updatedAt
        urlPreviews {
            ...UrlPreviewFields
        }
        reactions {
            code
            count
        }
        myReactions
        parentId
        childrenCount
        replyTo
    }
`);

export const MessagesResultFieldsFragment = graphql(`
    fragment MessagesResultFields on MessagesResult {
        messages {
            ...MessageFields
        }
        refs {
            id
            userId
            content
        }
    }
`);

const POST_MESSAGE = graphql(`
    mutation CreateMessage($messageDto: MessageDtoInput!) {
        messages {
            addMessage(messageDto: $messageDto) {
                ...MessageFields
            }
        }
    }
`);

export const postNewMessage = async (client: ApolloClient, messageDto: CreateMessageDto): Promise<MessageWithUser> => {
    try {
        const { data } = await client.mutate({
            mutation: POST_MESSAGE,
            variables: { messageDto },
        });

        const message = data?.messages?.addMessage;

        if (!message?.id || message?.content === undefined) {
            throw new Error('Invalid addMessage response');
        }

        return message;
    } catch (error) {
        throw new Error(`Adding message failed: ${(error as Error).message}`);
    }
};

const UPDATE_MESSAGE = graphql(`
    mutation UpdateMessage($message: MessageUpdateDtoInput!) {
        messages {
            updateMessage(message: $message)
        }
    }
`);

export const updateMessage = async (client: ApolloClient, dto: UpdateMessageDto): Promise<boolean> => {
    try {
        const { data } = await client.mutate({
            mutation: UPDATE_MESSAGE,
            variables: { message: dto },
        });
        return data?.messages?.updateMessage === true;
    } catch (error) {
        throw new Error(`Updating message failed: ${(error as Error).message}`);
    }
};

const DELETE_MESSAGE = graphql(`
    mutation DeleteMessage($id: Int!) {
        messages {
            deleteMessage(id: $id)
        }
    }
`);

export const deleteMessage = async (client: ApolloClient, messageId: MessageId): Promise<boolean> => {
    try {
        const { data } = await client.mutate({
            mutation: DELETE_MESSAGE,
            variables: { id: messageId },
        });

        const result = data?.messages?.deleteMessage;

        if (typeof result !== 'boolean') {
            throw new Error('Invalid deleteMessage response');
        }

        return result;
    } catch (error) {
        throw new Error(`Deleting message failed: ${(error as Error).message}`);
    }
};

const ADD_REACTION = graphql(`
    mutation AddReaction($code: String!, $messageId: Int!) {
        messages {
            addReaction(code: $code, messageId: $messageId) {
                status
                message
            }
        }
    }
`);

export const addReaction = async (client: ApolloClient, messageId: MessageId, code: string): Promise<boolean> => {
    try {
        const { data } = await client.mutate({
            mutation: ADD_REACTION,
            variables: { code, messageId },
        });

        const result = data?.messages?.addReaction;

        if (!result) {
            throw new Error('Invalid addReaction response');
        }

        if (result.status === 'error') {
            throw new Error(result.message ?? undefined);
        }

        return result.status === 'success';
    } catch (error) {
        throw new Error(`Adding reaction failed: ${(error as Error).message}`);
    }
};

const DELETE_REACTION = graphql(`
    mutation DeleteReaction($code: String!, $messageId: Int!) {
        messages {
            deleteReaction(code: $code, messageId: $messageId) {
                status
                message
            }
        }
    }
`);

export const deleteReaction = async (client: ApolloClient, messageId: MessageId, code: string): Promise<boolean> => {
    try {
        const { data } = await client.mutate({
            mutation: DELETE_REACTION,
            variables: { code, messageId },
        });

        const result = data?.messages?.deleteReaction;

        if (!result) {
            throw new Error('Invalid deleteReaction response');
        }

        if (result.status === 'error') {
            throw new Error(result.message ?? undefined);
        }

        return result.status === 'success';
    } catch (error) {
        throw new Error(`Deleting reaction failed: ${(error as Error).message}`);
    }
};

const GET_CHANNEL_MESSAGES = graphql(`
    query GetChannelMessages($channelId: Int!) {
        messages {
            listChannelMessages(channelId: $channelId) {
                ...MessagesResultFields
            }
        }
    }
`);

export const getChannelMessagesList = async (client: ApolloClient, channelId: ChannelId): Promise<MessagesResult> => {
    try {
        const { data } = await client.query({
            query: GET_CHANNEL_MESSAGES,
            variables: { channelId },
        });
        return data?.messages?.listChannelMessages ?? { messages: [], refs: [] };
    } catch (error) {
        throw new Error(`Can't get channel messages list: ${(error as Error).message}`);
    }
};

const GET_THREAD_MESSAGES = graphql(`
    query GetThreadMessages($threadId: Int!) {
        messages {
            listThreadMessages(threadId: $threadId) {
                ...MessagesResultFields
            }
        }
    }
`);

export const getThreadMessagesList = async (client: ApolloClient, threadId: MessageId): Promise<MessagesResult> => {
    try {
        const { data } = await client.query({
            query: GET_THREAD_MESSAGES,
            variables: { threadId },
        });
        return data?.messages?.listThreadMessages ?? { messages: [], refs: [] };
    } catch (error) {
        throw new Error(`Can't get thread messages list: ${(error as Error).message}`);
    }
};
