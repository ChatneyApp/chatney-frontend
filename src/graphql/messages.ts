import { gql, type TypedDocumentNode } from '@apollo/client';

import { Message } from '@/types/messages';

export type GetMessagesResponse = {
    messages: {
        listChannelMessages: Message[];
    }
}

export const POST_MESSAGE = gql`
    mutation CreateChannel($messageDto: MessageDTOInput!) {
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

export const GET_MESSAGES: TypedDocumentNode<GetMessagesResponse> = gql`
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
