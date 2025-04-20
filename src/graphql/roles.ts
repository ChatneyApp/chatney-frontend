import {gql, type TypedDocumentNode} from '@apollo/client';

import {Role} from '@/types/roles';

export type GetRolesListResponse = {
    getRolesList: Role[];
}

export const CREATE_ROLE = gql`
    mutation CreateRole($roleData: CreateRoleDTO!) {
        createRole(RoleData: $roleData) {
            Id
            Name
            Permissions
            Settings {
                Base
            }
        }
    }
`;

export const EDIT_ROLE = gql`
    mutation EditRole($roleData: EditRoleDTO!) {
        editRole(RoleData: $roleData) {
            Id
            Name
            Permissions
            Settings {
                Base
            }
        }
    }
`;

export const DELETE_ROLE = gql`
    mutation($roleId: String) {
        deleteRole(roleId: $roleId)
    }
`;

export const GET_ROLES_QUERY: TypedDocumentNode<GetRolesListResponse> = gql`
    {
        getRolesList {
            Id
            Name
            Permissions
            Settings {
                Base
            }
        }
    }
`;
