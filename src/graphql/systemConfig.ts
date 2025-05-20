import {gql, type TypedDocumentNode} from '@apollo/client';

import {SystemConfigValue} from '@/types/systemConfig';

export type GetChannelTypesListResponse = {
    getSystemConfig: SystemConfigValue[];
}

export const UDPATE_SYSTEM_CONFIG_VALUE = gql`
  mutation UpdateChannelType(
    $configName: String!
    $configValue: String!
  ) {
      updateSystemConfigValue(
        configName: $configName
        configValue: $configValue
    ) {
      Name
      Value
    }
  }
`;

export const GET_SYSTEM_CONFIG_QUERY: TypedDocumentNode<GetChannelTypesListResponse> = gql`
    {
        getSystemConfig {
            Name
            Value
        }
    }
`;
