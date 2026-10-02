import { ApolloClient } from '@apollo/client';

import { graphql } from '@/graphql/generated';
import { User, UserId } from '@/types/users';
import { DirectMessageUser } from '@/types/channels';

export const UserFieldsFragment = graphql(`
    fragment UserFields on User {
        id
        nickname
        fullName
        active
        verified
        banned
        muted
        email
        avatarUrl
    }
`);

const GET_USER_BY_ID = graphql(`
    query GetUserById($id: UUID!) {
        users {
            userById(id: $id) {
                ...UserFields
            }
        }
    }
`);

export const getUserById = async (client: ApolloClient, id: UserId): Promise<User> => {
    try {
        const { data } = await client.query({
            query: GET_USER_BY_ID,
            variables: { id },
            fetchPolicy: 'no-cache', // Optional: Prevents caching if you want always fresh data
        });

        const user = data?.users?.userById;

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } catch (error) {
        throw new Error(`Fetching user failed: ${(error as Error).message}`);
    }
};

export const SEARCH_USERS_BY_NICKNAME = graphql(`
    query SearchUsersByNickname($prefix: String!) {
        users {
            searchByNickname(prefix: $prefix) {
                ...DirectMessageUserFields
            }
        }
    }
`);

export const searchUsersByNickname = async (
    client: ApolloClient,
    prefix: string,
): Promise<DirectMessageUser[]> => {
    try {
        const { data } = await client.query({
            query: SEARCH_USERS_BY_NICKNAME,
            variables: { prefix },
            fetchPolicy: 'no-cache',
        });

        return data?.users?.searchByNickname ?? [];
    } catch (error) {
        throw new Error(`Searching users failed: ${(error as Error).message}`);
    }
};
