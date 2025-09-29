import { ApolloClient, gql, type TypedDocumentNode } from '@apollo/client';

import { CreateMessageDto, Message } from '@/types/messages';
import { ChannelId } from '@/types/channels';

export const postNewMessage = async (client: ApolloClient<object>, messageDto: CreateMessageDto): Promise<Message> => {
    const POST_MESSAGE = gql`
        mutation CreateMessage($messageDto: MessageDTOInput!) {
            messages {
                addMessage(messageDto: $messageDto) {
                    id
                    channelId
                    userId
                    content
                    attachments
                    status
                    createdAt
                    updatedAt
                    reactions {
                        userId
                        reactionText
                    }
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

type GetMessagesResponse = {
    messages: {
        listChannelMessages: Message[];
    }
}

export const getChannelMessagesList = async (client: ApolloClient<object>, channelId: ChannelId): Promise<Message[]> => {
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
                reactions {
                    userId
                    reactionText
                }
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
