import { ApolloClient } from '@apollo/client';

import { graphql } from '@/graphql/generated';
import { Workspace } from '@/types/workspaces';

export const WorkspaceFieldsFragment = graphql(`
    fragment WorkspaceFields on Workspace {
        id
        name
        secObjId
        createdAt
        updatedAt
    }
`);

export const AddWorkspaceMutation = graphql(`
    mutation AddWorkspace($name: String!) {
        workspaces {
            addWorkspace(workspaceDto: { name: $name }) {
                ...WorkspaceFields
            }
        }
    }
`);

export const addWorkspace = async (client: ApolloClient, name: string): Promise<Workspace> => {
    try {
        const { data } = await client.mutate({
            mutation: AddWorkspaceMutation,
            variables: { name },
        });

        const workspace = data?.workspaces?.addWorkspace;

        if (!workspace?.id || !workspace?.name) {
            throw new Error('Invalid addWorkspace response');
        }

        return workspace;
    } catch (error) {
        throw new Error(`Adding workspace failed: ${(error as Error).message}`);
    }
};

export const UPDATE_WORKSPACE = graphql(`
    mutation UpdateWorkspace($workspace: WorkspaceInput!) {
        workspaces {
            updateWorkspace(workspace: $workspace) {
                ...WorkspaceFields
            }
        }
    }
`);

export const DELETE_WORKSPACE = graphql(`
    mutation DeleteWorkspace($id: Int!) {
        workspaces {
            deleteWorkspace(id: $id)
        }
    }
`);

const GET_WORKSPACES = graphql(`
    query GetWorkspaces {
        workspaces {
            list {
                ...WorkspaceFields
            }
        }
    }
`);

export const getWorkspacesQuery = async (client: ApolloClient) => {
    const { data } = await client.query({
        query: GET_WORKSPACES,
    });

    return data?.workspaces?.list ?? [];
}
