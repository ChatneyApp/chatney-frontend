import { ApolloClient } from '@apollo/client';

import { graphql } from '@/graphql/generated';

export const ConfigFieldsFragment = graphql(`
    fragment ConfigFields on Config {
        id
        name
        value
        type
    }
`);

export const UPDATE_SYSTEM_CONFIG_VALUE = graphql(`
    mutation UpdateSystemConfigValue($config: ConfigInput!) {
        configs {
            updateConfig(config: $config) {
                ...ConfigFields
            }
        }
    }
`);

export const GET_SYSTEM_CONFIG = graphql(`
    query GetSystemConfig {
        configs {
            list {
                ...ConfigFields
            }
        }
    }
`);

const INSTALL_SYSTEM = graphql(`
    mutation InstallSystem {
        installWizard {
            installSystem {
                status
                message
            }
        }
    }
`);

export const installSystem = async (client: ApolloClient): Promise<boolean> => {
    try {
        const { data } = await client.mutate({
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
