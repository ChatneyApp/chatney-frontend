import {gql, type TypedDocumentNode} from '@apollo/client';

import {ChannelGroup} from '@/types/channelGroups';

export type GetChannelGroupsListResponse = {
    listChannelGroups: ChannelGroup[];
}

export const CREATE_CHANNEL_GROUP = gql`
    mutation CreateChannelGroup($input: CreateChannelGroupInput!) {
        createChannelGroup(input: $input) {
            Id
            name
            channels
            order
            workspace
        }
    }
`;

export const UPDATE_CHANNEL_GROUP = gql`
    mutation UpdateChannelGroup($input: UpdateChannelGroupInput!) {
        updateChannelGroup(input: $input) {
            Id
            name
            channels
            order
            workspace
        }
    }
`;

export const DELETE_CHANNEL_GROUP = gql`
    mutation DeleteChannelGroup($channelGroupId: ID!) {
        deleteChannelGroup(UUID: $channelGroupId)
    }
`;

export const GET_WORKSPACE_CHANNEL_GROUPS_QUERY: TypedDocumentNode<GetChannelGroupsListResponse> = gql`
    query ($workspaceId: String!) {
        listChannelGroups(workspaceId: $workspaceId) {
            Id
            name
            channels
            order
            workspace
        }
    }
`;
