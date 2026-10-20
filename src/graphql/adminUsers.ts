import { graphql } from '@/graphql/generated';

// roleIds is filled only by users.list (and only for callers with UserEditUser), so it stays out of UserFields
export const AdminUserFieldsFragment = graphql(`
    fragment AdminUserFields on User {
        ...UserFields
        roleIds
    }
`);

export const GET_USERS = graphql(`
    query GetUsersList($filter: UserFilterInput!) {
        users {
            list(filter: $filter) {
                ...AdminUserFields
            }
        }
    }
`);

export const CREATE_USER = graphql(`
    mutation CreateUser($userDto: CreateUserDtoInput!) {
        users {
            createUser(userDto: $userDto) {
                ...UserFields
            }
        }
    }
`);

export const UPDATE_USER = graphql(`
    mutation UpdateUser($userDto: UpdateUserDtoInput!) {
        users {
            updateUser(userDto: $userDto) {
                ...UserFields
            }
        }
    }
`);

export const DELETE_USER = graphql(`
    mutation DeleteUser($id: UUID!) {
        users {
            deleteUser(id: $id)
        }
    }
`);
