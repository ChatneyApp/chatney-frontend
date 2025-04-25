import {gql, type TypedDocumentNode} from '@apollo/client';

import {Channel} from '@/types/channels';

export type GetChannelsListResponse = {
    getWorkspaceChannelsList: Channel[];
}

export const CREATE_CHANNEL = gql`
    mutation CreateChannel($input: MutateChannelDTO!) {
        createChannel(input: $input) {
            Id
            Name
            ChannelTypeId
            WorkspaceId
        }
    }
`;

export const UPDATE_CHANNEL = gql`
    mutation UpdateChannel($channelId: String!, $input: MutateChannelDTO!) {
        updateChannel(channelId: $channelId, input: $input) {
            Id
            Name
            ChannelTypeId
            WorkspaceId
        }
    }
`;

export const DELETE_CHANNEL = gql`
    mutation DeleteChannel($channelId: String!) {
        deleteChannel(channelId: $channelId)
    }
`;

export const GET_WORKSPACE_CHANNELS_QUERY: TypedDocumentNode<GetChannelsListResponse> = gql`
    query ($workspaceId: String!) {
        getWorkspaceChannelsList(workspaceId: $workspaceId) {
            Id
            Name
            ChannelTypeId
            WorkspaceId
        }
    }
`;
