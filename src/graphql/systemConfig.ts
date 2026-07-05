import { ApolloClient, gql } from '@apollo/client';

import { SystemConfigValue } from '@/types/systemConfig';

export type GetConfigListResponse = {
    configs: {
        list: SystemConfigValue[];
    }
}

export type InstallSystemResponse = {
    installWizard: {
        installSystem: {
            status: string;
            message?: string | null;
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

        const result = data?.installWizard?.installSystem;
        if (!result) {
            throw new Error('System install error');
        }

        if (result.status !== 'success' && result.status !== 'installed') {
            throw new Error(result.message ?? `Install failed with status: ${result.status}`);
        }

        return true;
    } catch (error) {
        throw new Error(`Installing system failed: ${(error as Error).message}`);
    }
};
