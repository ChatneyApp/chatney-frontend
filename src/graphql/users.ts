import {gql, type TypedDocumentNode} from '@apollo/client';

import type {UserAuthorization, User} from '@/types/users';

export type AuthorizeUserResponse = {
    AuthorizeUser: UserAuthorization;
}

export type GetUserResponse = {
    GetUser: User;
}

export const REGISTER_USER = gql`
    mutation RegisterUser($input: CreateUserDTO!) {
        CreateUser(input: $input) {
            Id
            Email
            Username
        }
    }
`;

export const LOGIN: TypedDocumentNode<AuthorizeUserResponse> = gql`
    query ($login: String!, $password: String!) {
        AuthorizeUser(login: $login, password: $password) {
            Id
            Token
        }
    }
`;

export const GET_USER_QUERY: TypedDocumentNode<GetUserResponse> = gql`
    query ($id: String!) {
        GetUser(userId: $id) {
            Id
            Name
            Email
        }
    }
`;
