import {gql, type TypedDocumentNode} from '@apollo/client';

import {ChannelType} from '@/types/channelTypes';

export type GetChannelTypesListResponse = {
    getAllChannelTypesList: ChannelType[];
}

export const CREATE_CHANNEL_TYPE = gql`
    mutation CreateChannelType($input: MutateChannelTypeDTO!) {
        createChannelType(input: $input) {
            Id
            Label
            Key
            BaseRoleId
        }
    }
`;

export const EDIT_CHANNEL_TYPE = gql`
  mutation UpdateChannelType(
    $channelTypeId: String!
    $input: MutateChannelTypeDTO!
  ) {
    updateChannelType(
      input: $input
      channelTypeId: $channelTypeId
    ) {
      Id
      Label
      Key
      BaseRoleId
    }
  }
`;

export const DELETE_CHANNEL_TYPE = gql`
    mutation($channelTypeId: String!) {
        deleteChannelType(channelTypeId: $channelTypeId)
    }
`;

export const GET_CHANNEL_TYPES_QUERY: TypedDocumentNode<GetChannelTypesListResponse> = gql`
    {
        getAllChannelTypesList {
            Id
            Label
            Key
            BaseRoleId
        }
    }
`; 