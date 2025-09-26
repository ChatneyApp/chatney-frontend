import { ApolloClient, gql, type TypedDocumentNode } from '@apollo/client';

import { Channel } from '@/types/channels';

export type GetChannelsListResponse = {
    channels: {
        workspaceChannelList: Channel[];
    }
}
export type GetChannelResponse = {
    GetChannel: Channel;
}

export const CREATE_CHANNEL = gql`
    mutation($channelDto: ChannelDTOInput!) {
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
    mutation ($id: String!) {
        channels {
            deleteChannel(id: $id)
        }
    }
`;

export const getWorkspaceChannels = async ({
    client,
    workspaceId,
}: {
    client: ApolloClient<any>,
    workspaceId: string,
}): Promise<Array<{
    id: string;
    name: string;
    channelTypeId: string;
    workspaceId: string;
}>> => {
    try {
        const { data } = await client.query({
            query: gql`
                query GetWorkspaceChannels($workspaceId: String!) {
                    channels {
                        workspaceChannelList(workspaceId: $workspaceId) {
                            id
                            name
                            channelTypeId
                            workspaceId
                        }
                    }
                }
            `,
            variables: { workspaceId },
            fetchPolicy: 'no-cache', // Optional: Ensures fresh data
        });

        const channels = data?.channels?.workspaceChannelList;

        if (!Array.isArray(channels)) {
            throw new Error('Invalid workspaceChannelList response');
        }

        return channels;
    } catch (error: any) {
        throw new Error(`Fetching channels failed: ${error.message}`);
    }
};
