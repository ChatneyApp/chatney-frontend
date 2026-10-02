import { ApolloClient } from '@apollo/client';

import { graphql } from '@/graphql/generated';
import type { DirectMessageFieldsFragment } from '@/graphql/generated/graphql';
import { Channel } from '@/types/channels';
import { WorkspaceId } from '@/types/workspaces';
import { ChannelTypeId } from '@/types/channelTypes';

export const ChannelFieldsFragment = graphql(`
    fragment ChannelFields on Channel {
        id
        name
        channelTypeId
        workspaceId
        isDm
        secObjId
        createdAt
        updatedAt
    }
`);

export const GET_WORKSPACE_CHANNELS = graphql(`
    query GetWorkspaceChannels($workspaceId: Int!) {
        channels {
            workspaceChannelList(workspaceId: $workspaceId) {
                ...ChannelFields
            }
        }
    }
`);

export const CREATE_CHANNEL = graphql(`
    mutation CreateChannel($channelDto: ChannelDtoInput!) {
        channels {
            addChannel(channelDto: $channelDto) {
                ...ChannelFields
            }
        }
    }
`);

export const AddChannelMutation = graphql(`
    mutation AddChannel(
        $name: String!
        $channelTypeId: Int!
        $workspaceId: Int!
    ) {
        channels {
            addChannel(channelDto: {
                name: $name
                channelTypeId: $channelTypeId
                workspaceId: $workspaceId
            }) {
                ...ChannelFields
            }
        }
    }
`);

export const addChannel = async (client: ApolloClient, name: string, channelTypeId: ChannelTypeId, workspaceId: WorkspaceId): Promise<Channel> => {
    try {
        const { data } = await client.mutate({
            mutation: AddChannelMutation,
            variables: { name, channelTypeId, workspaceId },
        });

        const channel = data?.channels?.addChannel;

        if (!channel?.id || !channel?.name) {
            throw new Error('Invalid addChannel response');
        }

        return channel;
    } catch (error) {
        throw new Error(`Adding channel failed: ${(error as Error).message}`);
    }
};

export const UPDATE_CHANNEL = graphql(`
    mutation UpdateChannel($channel: ChannelInput!) {
        channels {
            updateChannel(channel: $channel) {
                ...ChannelFields
            }
        }
    }
`);

export const DELETE_CHANNEL = graphql(`
    mutation DeleteChannel($id: Int!) {
        channels {
            deleteChannel(id: $id)
        }
    }
`);

export const getWorkspaceChannels = async ({
    client,
    workspaceId,
}: {
    client: ApolloClient,
    workspaceId: WorkspaceId,
}): Promise<Array<Channel>> => {
    try {
        const { data } = await client.query({
            query: GET_WORKSPACE_CHANNELS,
            variables: { workspaceId },
            fetchPolicy: 'no-cache', // Optional: Ensures fresh data
        });

        const channels = data?.channels?.workspaceChannelList;

        if (!Array.isArray(channels)) {
            throw new Error('Invalid workspaceChannelList response');
        }

        return channels;
    } catch (error) {
        throw new Error(`Fetching channels failed: ${(error as Error).message}`);
    }
};

export const DirectMessageUserFieldsFragment = graphql(`
    fragment DirectMessageUserFields on DirectMessageUser {
        id
        nickname
        avatarUrl
    }
`);

export const DirectMessageFields = graphql(`
    fragment DirectMessageFields on DirectMessage {
        channel {
            ...ChannelFields
        }
        otherUsers {
            ...DirectMessageUserFields
        }
    }
`);

const GetDirectMessagesQuery = graphql(`
    query GetDirectMessages {
        channels {
            directMessageList {
                ...DirectMessageFields
            }
        }
    }
`);

const toChannel = (directMessage: DirectMessageFieldsFragment): Channel => ({
    ...directMessage.channel,
    otherUsers: directMessage.otherUsers,
});

export const getDirectMessages = async (client: ApolloClient): Promise<Channel[]> => {
    try {
        const { data } = await client.query({
            query: GetDirectMessagesQuery,
            fetchPolicy: 'no-cache',
        });

        const list = data?.channels?.directMessageList;
        if (!Array.isArray(list)) {
            throw new Error('Invalid directMessageList response');
        }

        return list.map(toChannel);
    } catch (error) {
        throw new Error(`Fetching direct messages failed: ${(error as Error).message}`);
    }
};

const OpenDirectMessageMutation = graphql(`
    mutation OpenDirectMessage($otherUserIds: [UUID!]!) {
        channels {
            openDirectMessage(otherUserIds: $otherUserIds) {
                ...DirectMessageFields
            }
        }
    }
`);

export const openDirectMessage = async (client: ApolloClient, otherUserIds: string[]): Promise<Channel> => {
    try {
        const { data } = await client.mutate({
            mutation: OpenDirectMessageMutation,
            variables: { otherUserIds },
        });

        const directMessage = data?.channels?.openDirectMessage;
        if (!directMessage?.channel?.id) {
            throw new Error('Invalid openDirectMessage response');
        }

        return toChannel(directMessage);
    } catch (error) {
        throw new Error(`Opening direct message failed: ${(error as Error).message}`);
    }
};
