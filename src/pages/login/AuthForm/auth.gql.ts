import { ApolloClient, gql } from "@apollo/client";

export const loginUser = async ({ client, login, password }: {
    client: ApolloClient<any>,
    login: string,
    password: string,
}): Promise<{ token: string, id: string }> => {
    try {
        const { data } = await client.mutate({
            mutation: gql`
                mutation Login($login: String!, $password: String!) {
                    users {
                        login(login: $login, password: $password) {
                            id
                            token
                        }
                    }
                }
            `,
            variables: { login, password },
        });

        const token = data?.users?.login?.token;
        const id = data?.users?.login?.id;

        if (!token || !id) {
            throw new Error('Invalid login response');
        }

        return { token, id };
    } catch (error: any) {
        throw new Error(`Login failed: ${error.message}`);
    }
};

export const registerUser = async ({ client, email,
    password,
    username
}: {
    client: ApolloClient<any>,
    email: string,
    username: string,
    password: string,
}): Promise<void> => {
    try {
        const { data } = await client.mutate({
            mutation: gql`
                mutation RegisterUser($input: CreateUserDTO!) {
                    users {
                        register(userDTO: $input) {
                            id
                            name
                            email
                        }
                    }
                }
            `,
            variables: { email, username, password },
        });

        const id = data?.users?.register?.id;

        if (!id) {
            throw new Error('Invalid register response');
        }
    } catch (error: any) {
        throw new Error(`Login failed: ${error.message}`);
    }
};
