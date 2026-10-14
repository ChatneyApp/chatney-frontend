import { graphql } from '@/graphql/generated';

export const RoleFieldsFragment = graphql(`
    fragment RoleFields on Role {
        id
        name
        createdAt
        updatedAt
    }
`);

export const CREATE_ROLE = graphql(`
    mutation CreateRole($roleDto: RoleCreateDtoInput!) {
        roles {
            addRole(roleDto: $roleDto) {
                ...RoleFields
            }
        }
    }
`);

export const EDIT_ROLE = graphql(`
    mutation UpdateRole($roleDto: RoleUpdateDtoInput!) {
        roles {
            updateRole(roleDto: $roleDto) {
                ...RoleFields
            }
        }
    }
`);

export const DELETE_ROLE = graphql(`
    mutation DeleteRole($id: Int!) {
        roles {
            deleteRole(id: $id)
        }
    }
`);

export const GET_ROLES = graphql(`
    query GetRoles {
        roles {
            list {
                ...RoleFields
            }
        }
    }
`);
