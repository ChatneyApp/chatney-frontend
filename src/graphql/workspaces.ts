import { ApolloClient, gql, type TypedDocumentNode } from '@apollo/client';

import { Workspace } from '@/types/workspaces';

export type GetWorkspacesListResponse = {
    workspaces: {
        list: Workspace[];
    }
}

export const addWorkspace = async ({
    client,
    name,
}: {
    client: ApolloClient<any>,
    name: string,
}): Promise<{
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}> => {
    try {
        const { data } = await client.mutate({
            mutation: gql`
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
            `,
            variables: { name },
        });

        const workspace = data?.workspaces?.addWorkspace;

        if (!workspace?.id || !workspace?.name) {
            throw new Error('Invalid addWorkspace response');
        }

        return workspace;
    } catch (error: any) {
        throw new Error(`Adding workspace failed: ${error.message}`);
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

export const GET_WORKSPACES_QUERY: TypedDocumentNode<GetWorkspacesListResponse> = gql`
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
