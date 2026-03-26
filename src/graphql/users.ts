import { User, UserId } from '@/types/users';
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
                name
                active
                verified
                banned
                muted
                email
                workspaces
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
