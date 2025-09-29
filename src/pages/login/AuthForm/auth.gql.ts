import { ApolloClient, gql } from "@apollo/client";

export const loginUser = async ({ client, login, password }: {
    client: ApolloClient<object>,
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
    } catch (error) {
        throw new Error(`Login failed: ${(error as Error).message}`);
    }
};

export const registerUser = async ({ client, email,
    password,
    name
}: {
    client: ApolloClient<object>,
    email: string,
    name: string,
    password: string,
}): Promise<void> => {
    try {
        const { data } = await client.mutate({
            mutation: gql`
                mutation RegisterUser($input: UserRegisterDTOInput!) {
                    users {
                        register(userDTO: $input) {
                            id
                            name
                            email
                        }
                    }
                }
            `,
            variables: { input: { email, name, password } },
        });

        const id = data?.users?.register?.id;

        if (!id) {
            throw new Error('Invalid register response');
        }
    } catch (error) {
        throw new Error(`Login failed: ${(error as Error).message}`);
    }
};
