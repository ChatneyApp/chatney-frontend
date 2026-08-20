import { User, UserId } from '@/types/users';
import { DirectMessageUser } from '@/types/channels';
import { ApolloClient, gql } from '@apollo/client';

type GetUserByIdResponse = {
    users?: {
        userById?: User;
    }
}

const GET_USER_BY_ID_QUERY = gql`
    query GetUserById($id: UUID!) {
        users {
            userById(id: $id) {
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
        }
    }
`;

export const getUserById = async (client: ApolloClient, id: UserId): Promise<User> => {
    try {
        const { data } = await client.query<GetUserByIdResponse>({
            query: GET_USER_BY_ID_QUERY,
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

export const SEARCH_USERS_BY_NICKNAME_QUERY = gql`
    query SearchUsersByNickname($prefix: String!) {
        users {
            searchByNickname(prefix: $prefix) {
                id
                nickname
                avatarUrl
            }
        }
    }
`;

type SearchUsersByNicknameResponse = {
    users?: {
        searchByNickname?: DirectMessageUser[];
    }
};

export const searchUsersByNickname = async (
    client: ApolloClient,
    prefix: string,
): Promise<DirectMessageUser[]> => {
    try {
        const { data } = await client.query<SearchUsersByNicknameResponse>({
            query: SEARCH_USERS_BY_NICKNAME_QUERY,
            variables: { prefix },
            fetchPolicy: 'no-cache',
        });

        return data?.users?.searchByNickname ?? [];
    } catch (error) {
        throw new Error(`Searching users failed: ${(error as Error).message}`);
    }
};
