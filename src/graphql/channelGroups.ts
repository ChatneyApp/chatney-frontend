import { graphql } from '@/graphql/generated';

export const ChannelGroupFieldsFragment = graphql(`
    fragment ChannelGroupFields on ChannelGroup {
        id
        name
        workspaceId
        channelIds
        order
        createdAt
        updatedAt
    }
`);

export const CREATE_CHANNEL_GROUP = graphql(`
    mutation CreateChannelGroup($channelGroupDto: ChannelGroupDtoInput!) {
        channels {
            addChannelGroup(channelGroupDto: $channelGroupDto) {
                ...ChannelGroupFields
            }
        }
    }
`);

export const UPDATE_CHANNEL_GROUP = graphql(`
    mutation UpdateChannelGroup($channelGroup: ChannelGroupInput!) {
        channels {
            updateChannelGroup(channelGroup: $channelGroup) {
                ...ChannelGroupFields
            }
        }
    }
`);

export const DELETE_CHANNEL_GROUP = graphql(`
    mutation DeleteChannelGroup($id: Int!) {
        channels {
            deleteChannelGroup(id: $id)
        }
    }
`);

export const GET_WORKSPACE_CHANNEL_GROUPS = graphql(`
    query GetWorkspaceChannelGroups($workspaceId: Int!) {
        channels {
            workspaceChannelGroupList(workspaceId: $workspaceId) {
                ...ChannelGroupFields
            }
        }
    }
`);
