import { ApolloClient, gql } from '@apollo/client';

import { SystemConfigValue } from '@/types/systemConfig';

export type GetConfigListResponse = {
    configs: {
        list: SystemConfigValue[];
    }
}

export type InstallSystemResponse = {
    configs: {
        installSystem: {
            status: string;
            message: string;
        }
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

export const GET_SYSTEM_CONFIG_QUERY  = gql`
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

export const installSystem = async (client: ApolloClient): Promise<boolean> => {
    const INSTALL_SYSTEM = gql`
        mutation {
            installWizard {
                installSystem {
                    status
                    message
                }
            }
        }
    `;
    try {
        const { data } = await client.mutate<InstallSystemResponse>({
            mutation: INSTALL_SYSTEM,
        });

        if (!data?.configs.installSystem) {
            throw new Error('System install error');
        }

        return true;
    } catch (error) {
        throw new Error(`Installing system failed: ${(error as Error).message}`);
    }
};
