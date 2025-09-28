import { gql, type TypedDocumentNode } from '@apollo/client';

import { SystemConfigValue } from '@/types/systemConfig';

export type GetChannelTypesListResponse = {
    configs: {
        list: SystemConfigValue[];
    }
}

export const UDPATE_SYSTEM_CONFIG_VALUE = gql`
  mutation ($config: ConfigInput!) {
      configs {
          updateConfig(config: $config) {
              id
              name
              value
              type
          }
      }
  }
`;

export const GET_SYSTEM_CONFIG_QUERY: TypedDocumentNode<GetChannelTypesListResponse> = gql`
    query {
        configs {
            list {
                id
                name
                value
                type
            }
        }
    }
`;
