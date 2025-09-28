import { gql, type TypedDocumentNode } from '@apollo/client';

import { ChannelType } from '@/types/channelTypes';

export type GetChannelTypesListResponse = {
    channels: {
        channelTypeList: ChannelType[];
    }
}

export const CREATE_CHANNEL_TYPE = gql`
    mutation ($channelTypeDto: ChannelTypeDTOInput!) {
        channels {
            addChannelType(channelTypeDto: $channelTypeDto) {
                id
                label
                key
                baseRoleId
            }
        }
    }
`;

export const EDIT_CHANNEL_TYPE = gql`
    mutation ($channelType: ChannelTypeInput!) {
        channels {
            updateChannelType(channelType: $channelType) {
                id
                label
                key
                baseRoleId
            }
        }
    }
`;

export const DELETE_CHANNEL_TYPE = gql`
    mutation($id: String!) {
        channels {
            deleteChannelType(id: $id)
        }
    }
`;

export const GET_CHANNEL_TYPES_QUERY: TypedDocumentNode<GetChannelTypesListResponse> = gql`
    {
        channels {
            channelTypeList {
                id
                label
                key
                baseRoleId
            }
        }
    }

`; 
