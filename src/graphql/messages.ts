import { ApolloClient, gql, type TypedDocumentNode } from '@apollo/client';

import { CreateMessageDto, Message, MessageWithUser } from '@/types/messages';
import { ChannelId } from '@/types/channels';

export const postNewMessage = async (client: ApolloClient<object>, messageDto: CreateMessageDto): Promise<Message> => {
    const POST_MESSAGE = gql`
        mutation CreateMessage($messageDto: MessageDTOInput!) {
            messages {
                addMessage(messageDto: $messageDto) {
                    id
                    channelId
                    userId
                    user {
                        id
                        name
                        avatarUrl
                    }
                    content
                    attachments
                    status
                    createdAt
                    updatedAt
                    urlPreviews {
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
                    reactions {
                        code
                        count
                    }
                    myReactions
                    parentId
                }
            }
        }
    `;
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

export const deleteMessage = async (client: ApolloClient<object>, messageId: string): Promise<boolean> => {
    const DELETE_MESSAGE = gql`
        mutation DeleteMessage($id: String!) {
            messages {
                deleteMessage(id: $id)
            }
        }
    `;
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

type ChangeReactionResponse = {
    status: 'error' | 'success';
    error?: string;
};
export const addReaction = async (client: ApolloClient<object>, messageId: string, code: string): Promise<boolean> => {
    const GQL_MUTATION = gql`
        mutation AddReaction($code: String!, $messageId: String!) {
            messages {
                addReaction(code: $code, messageId: $messageId) {
                    status
                    message
                }
            }
        }
    `;
    try {
        const { data } = await client.mutate({
            mutation: GQL_MUTATION,
            variables: { code, messageId },
        });

        const result = data?.messages?.addReaction as ChangeReactionResponse;

        if (!result) {
            throw new Error('Invalid addReaction response');
        }

        if (result?.status === 'error') {
            throw new Error(result.error);
        }

        return result.status === 'success';
    } catch (error) {
        throw new Error(`Adding reaction failed: ${(error as Error).message}`);
    }
};

export const deleteReaction = async (client: ApolloClient<object>, messageId: string, code: string): Promise<boolean> => {
    const GQL_MUTATION = gql`
        mutation DeleteReaction($code: String!, $messageId: String!) {
            messages {
                deleteReaction(code: $code, messageId: $messageId) {
                    status
                    message
                }
            }
        }
    `;
    try {
        const { data } = await client.mutate({
            mutation: GQL_MUTATION,
            variables: { code, messageId },
        });

        const result = data?.messages?.deleteReaction as ChangeReactionResponse;

        if (!result) {
            throw new Error('Invalid deleteReaction response');
        }

        if (result?.status === 'error') {
            throw new Error(result.error);
        }

        return result.status === 'success';
    } catch (error) {
        throw new Error(`Deleting reaction failed: ${(error as Error).message}`);
    }
};

type GetMessagesResponse = {
    messages: {
        listChannelMessages: MessageWithUser[];
    }
}

export const getChannelMessagesList = async (client: ApolloClient<object>, channelId: ChannelId): Promise<MessageWithUser[]> => {
    const GET_MESSAGES: TypedDocumentNode<GetMessagesResponse> = gql`
    query ($channelId: String!) {
        messages {
            listChannelMessages(channelId: $channelId) {
                id
                channelId
                userId
                content
                attachments
                status
                createdAt
                updatedAt
                user {
                    id
                    name
                    avatarUrl
                }
                urlPreviews {
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
                reactions {
                    code
                    count
                }
                myReactions
                parentId
            }
        }
    }
`;
    try {
        const { data } = await client.query({
            query: GET_MESSAGES,
            variables: { channelId },
        });
        return data?.messages?.listChannelMessages ?? [];
    } catch (error) {
        throw new Error(`Can't get messages list: ${(error as Error).message}`);
    }
};
