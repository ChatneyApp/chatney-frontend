import {gql, type TypedDocumentNode} from '@apollo/client';

import {Channel} from '@/types/channels';

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

export const GET_WORKSPACE_CHANNELS_QUERY: TypedDocumentNode<GetChannelsListResponse> = gql`
    query ($workspaceId: String!) {
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
