import { graphql } from '@/graphql/generated';

export const ChannelTypeFieldsFragment = graphql(`
    fragment ChannelTypeFields on ChannelType {
        id
        name
        key
        secObjId
        createdAt
        updatedAt
    }
`);

export const CREATE_CHANNEL_TYPE = graphql(`
    mutation CreateChannelType($channelTypeDto: ChannelTypeDtoInput!) {
        channels {
            addChannelType(channelTypeDto: $channelTypeDto) {
                ...ChannelTypeFields
            }
        }
    }
`);

export const EDIT_CHANNEL_TYPE = graphql(`
    mutation UpdateChannelType($channelType: ChannelTypeInput!) {
        channels {
            updateChannelType(channelType: $channelType) {
                ...ChannelTypeFields
            }
        }
    }
`);

export const DELETE_CHANNEL_TYPE = graphql(`
    mutation DeleteChannelType($id: Int!) {
        channels {
            deleteChannelType(id: $id)
        }
    }
`);

export const GET_CHANNEL_TYPES = graphql(`
    query GetChannelTypes {
        channels {
            channelTypeList {
                ...ChannelTypeFields
            }
        }
    }
`);
