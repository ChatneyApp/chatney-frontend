import { User } from '@/types/users';
import { ApolloClient, gql } from '@apollo/client';

export const getUserById = async ({
  client,
  id,
}: {
  client: ApolloClient<object>,
  id: string,
}): Promise<User> => {
  try {
    const { data } = await client.query({
      query: gql`
        query GetUserById($id: String!) {
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
      `,
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
