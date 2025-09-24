import {gql, type TypedDocumentNode} from '@apollo/client';

import {Role} from '@/types/roles';

export type GetRolesListResponse = {
    roles: {
        list: Role[];
    }
}

export const CREATE_ROLE = gql`
    mutation ($roleDto: RoleDTOInput!) {
        roles {
            addRole (roleDto: $roleDto) {
                id
                name
                settings {
                    base
                }
                permissions
            }
        }
    }
`;

export const EDIT_ROLE = gql`
    mutation ($role: RoleInput!) {
        roles {
            updateRole (role: $role) {
                id
                name
                settings {
                    base
                }
                permissions
            }
        }
    }
`;

export const DELETE_ROLE = gql`
    mutation($id: String!) {
        roles {
            deleteRole(id: $id)
        }
    }
`;

export const GET_ROLES_QUERY: TypedDocumentNode<GetRolesListResponse> = gql`
    {
        roles {
            list {
                id
                name
                settings {
                    base
                }
                permissions
            }
        }
    }
`;
