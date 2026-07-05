import { gql, type TypedDocumentNode } from '@apollo/client';

import { User } from '@/types/users';

export type UserFilter = {
    active?: boolean | null;
    banned?: boolean | null;
    email?: string | null;
    name?: string | null;
};

export type GetUsersListResponse = {
    users: {
        list: User[];
    };
};

const userFields = `
    id
    name
    email
    avatarUrl
    active
    verified
    banned
    muted
    roleId
`;

export const GET_USERS_QUERY: TypedDocumentNode<GetUsersListResponse, { filter: UserFilter }> = gql`
    query GetUsersList($filter: UserFilterInput!) {
        users {
            list(filter: $filter) {
                ${userFields}
            }
        }
    }
`;

export const CREATE_USER = gql`
    mutation CreateUser($userDto: CreateUserDtoInput!) {
        users {
            createUser(userDto: $userDto) {
                ${userFields}
            }
        }
    }
`;

export const UPDATE_USER = gql`
    mutation UpdateUser($userDto: UpdateUserDtoInput!) {
        users {
            updateUser(userDto: $userDto) {
                ${userFields}
            }
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: UUID!) {
        users {
            deleteUser(id: $id)
        }
    }
`;
