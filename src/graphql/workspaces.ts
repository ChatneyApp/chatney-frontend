import { ApolloClient, gql } from '@apollo/client';

import { Workspace } from '@/types/workspaces';

const AddWorkspaceMutation = gql`
    mutation AddWorkspace($name: String!) {
        workspaces {
            addWorkspace(workspaceDto: { name: $name }) {
                id
                name
                createdAt
                updatedAt
            }
        }
    }
`;
type AddWorkspaceMutationResponse = {
    workspaces?: {
        addWorkspace?: Workspace;
    }
}

export const addWorkspace = async (client: ApolloClient, name: string): Promise<Workspace> => {
    try {
        const { data } = await client.mutate<AddWorkspaceMutationResponse>({
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

export const UPDATE_WORKSPACE = gql`
    mutation UpdateWorkspace($workspaceId: String!, $input: MutateWorkspaceDTO!) {
        updateWorkspace(workspaceId: $workspaceId, input: $input) {
            Id
            Name
        }
    }
`;

export const DELETE_WORKSPACE = gql`
    mutation DeleteWorkspace($workspaceId: String!) {
        deleteWorkspace(workspaceId: $workspaceId)
    }
`;

type GetWorkspacesListResponse = {
    workspaces?: {
        list?: Workspace[];
    }
}
export const getWorkspacesQuery = async (client: ApolloClient) => {
    const GET_WORKSPACES_QUERY = gql`
    {
        workspaces {
            list {
                id
                name
                createdAt
                updatedAt
            }
        }
    }
`;
    const { data } = await client.query<GetWorkspacesListResponse>({
        query: GET_WORKSPACES_QUERY,
    });

    return data?.workspaces?.list ?? [];
}
