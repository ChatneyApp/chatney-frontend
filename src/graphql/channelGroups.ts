import { gql, type TypedDocumentNode } from '@apollo/client';

import { ChannelGroup } from '@/types/channelGroups';

export type GetChannelGroupsListResponse = {
    channels: {
        workspaceChannelGroupList: ChannelGroup[];
    }
}

export const CREATE_CHANNEL_GROUP = gql`
    mutation($channelGroupDto: ChannelGroupDTOInput!) {
        channels {
            addChannelGroup(channelGroupDto: $channelGroupDto) {
                id
                name
                workspaceId
                channelIds
                order
            }
        }
    }
`;

export const UPDATE_CHANNEL_GROUP = gql`
    mutation ($channelGroup: ChannelGroupInput!) {
        channels {
            updateChannelGroup(channelGroup: $channelGroup) {
                id
                name
                workspaceId
                channelIds
                order
            }
        }
    }
`;

export const DELETE_CHANNEL_GROUP = gql`
    mutation ($id: String!) {
        channels {
            deleteChannelGroup(id: $id)
        }
    }
`;

export const GET_WORKSPACE_CHANNEL_GROUPS_QUERY: TypedDocumentNode<GetChannelGroupsListResponse> = gql`
    query ($workspaceId: String!) {
        channels {
            workspaceChannelGroupList(workspaceId: $workspaceId) {
                id
                name
                workspaceId
                channelIds
                order
            }
        }
    }
`;
