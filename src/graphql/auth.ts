import { ApolloClient } from '@apollo/client';

import { graphql } from '@/graphql/generated';
import { UserId } from '@/types/users';

const LOGIN_USER = graphql(`
    mutation Login($login: String!, $password: String!) {
        users {
            login(login: $login, password: $password) {
                id
                token
            }
        }
    }
`);

const REGISTER_USER = graphql(`
    mutation RegisterUser($input: UserRegisterDtoInput!) {
        users {
            register(userDto: $input) {
                id
                nickname
                fullName
                email
            }
        }
    }
`);

export const loginUser = async ({ client, login, password }: {
    client: ApolloClient,
    login: string,
    password: string,
}): Promise<{ token: string, id: UserId }> => {
    try {
        const { data } = await client.mutate({
            mutation: LOGIN_USER,
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
    nickname,
    fullName,
}: {
    client: ApolloClient,
    email: string,
    nickname: string,
    fullName?: string | null,
    password: string,
}): Promise<void> => {
    try {
        const { data } = await client.mutate({
            mutation: REGISTER_USER,
            variables: {
                input: {
                    email,
                    nickname,
                    fullName: fullName?.trim() || null,
                    password,
                },
            },
        });

        const id = data?.users?.register?.id;

        if (!id) {
            throw new Error('Invalid register response');
        }
    } catch (error) {
        throw new Error(`Registration failed: ${(error as Error).message}`);
    }
};
