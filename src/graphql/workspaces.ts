import {gql, type TypedDocumentNode} from '@apollo/client';

import {Workspace} from '@/types/workspaces';

export type GetWorkspacesListResponse = {
    getWorkspacesList: Workspace[];
}

export const CREATE_WORKSPACE = gql`
    mutation CreateWorkspace($input: MutateWorkspaceDTO!) {
        createWorkspace(input: $input) {
            Id
            Name
        }
    }
`;

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
        getWorkspacesList {
            Id
            Name
        }
    }
`; 