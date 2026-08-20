import { ApolloClient, gql, type TypedDocumentNode } from '@apollo/client';

import { Channel, DirectMessageUser } from '@/types/channels';
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
                isDm
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
    query ($channelId: Int!) {
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

const DirectMessageFields = gql`
    fragment DirectMessageFields on DirectMessage {
        channel {
            id
            name
            channelTypeId
            workspaceId
            isDm
        }
        otherUsers {
            id
            nickname
            avatarUrl
        }
    }
`;

const GetDirectMessagesQuery = gql`
    ${DirectMessageFields}
    query GetDirectMessages {
        channels {
            directMessageList {
                ...DirectMessageFields
            }
        }
    }
`;

type DirectMessageResponse = {
    channel: Channel;
    otherUsers: DirectMessageUser[];
};

type GetDirectMessagesResponse = {
    channels?: {
        directMessageList?: DirectMessageResponse[];
    }
};

const toChannel = (directMessage: DirectMessageResponse): Channel => ({
    ...directMessage.channel,
    otherUsers: directMessage.otherUsers,
});

export const getDirectMessages = async (client: ApolloClient): Promise<Channel[]> => {
    try {
        const { data } = await client.query<GetDirectMessagesResponse>({
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

const OpenDirectMessageMutation = gql`
    ${DirectMessageFields}
    mutation OpenDirectMessage($otherUserIds: [UUID!]!) {
        channels {
            openDirectMessage(otherUserIds: $otherUserIds) {
                ...DirectMessageFields
            }
        }
    }
`;

type OpenDirectMessageResponse = {
    channels?: {
        openDirectMessage?: DirectMessageResponse;
    }
};

export const openDirectMessage = async (client: ApolloClient, otherUserIds: string[]): Promise<Channel> => {
    try {
        const { data } = await client.mutate<OpenDirectMessageResponse>({
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
