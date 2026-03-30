import { ApolloClient, gql, type TypedDocumentNode } from '@apollo/client';

import { Channel } from '@/types/channels';
import { WorkspaceId } from '@/types/workspaces';
import { ChannelTypeId } from '@/types/channelTypes';

export const GetWorkspaceChannelsQuery = gql`
    query GetWorkspaceChannels($workspaceId: Int!) {
        channels {
            workspaceChannelList(workspaceId: $workspaceId) {
                id
                name
                channelTypeId
                workspaceId
            }
        }
    }
`;
export type GetChannelsListResponse = {
    channels: {
        workspaceChannelList: Channel[];
    }
}
export type GetChannelResponse = {
    GetChannel: Channel;
}

export const CREATE_CHANNEL = gql`
    mutation($channelDto: ChannelDtoInput!) {
        channels {
            addChannel(channelDto: $channelDto) {
                id
                name
                channelTypeId
                workspaceId
            }
        }
    }
`;

const AddChannelMutation = gql`
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
                id
                name
                channelTypeId
                workspaceId
                createdAt
                updatedAt
            }
        }
    }
`;
type AddChannelResponse = {
    channels?: {
        addChannel?: Channel;
    }
}
export const addChannel = async (client: ApolloClient, name: string, channelTypeId: ChannelTypeId, workspaceId: WorkspaceId): Promise<Channel> => {
    try {
        const { data } = await client.mutate<AddChannelResponse>({
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

export const GET_CHANNEL: TypedDocumentNode<GetChannelResponse> = gql`
    query ($channelId: String!) {
        GetChannel(channelId: $channelId) {
            Id
            Name
            ChannelTypeId
            WorkspaceId
        }
    }
`;

export const UPDATE_CHANNEL = gql`
    mutation ($channel: ChannelInput!) {
        channels {
            updateChannel(channel: $channel) {
                id
                name
                channelTypeId
                workspaceId
            }
        }
    }
`;

export const DELETE_CHANNEL = gql`
    mutation ($id: Int!) {
        channels {
            deleteChannel(id: $id)
        }
    }
`;

export const getWorkspaceChannels = async ({
    client,
    workspaceId,
}: {
    client: ApolloClient,
    workspaceId: WorkspaceId,
}): Promise<Array<Channel>> => {
    try {
        const { data } = await client.query<GetChannelsListResponse>({
            query: GetWorkspaceChannelsQuery,
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
