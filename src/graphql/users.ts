import {gql, type TypedDocumentNode} from '@apollo/client';

export type AuthorizeUserResponse = {
    AuthorizeUser: {
        Token: string;
    };
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
            Token
        }
    }
`;
