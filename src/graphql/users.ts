import {gql} from '@apollo/client';

export const REGISTER_USER = gql`
    mutation RegisterUser($input: CreateUserDTO!) {
        registerUser(input: $input) {
            Id
            Email
            Username
        }
    }
`;

export const LOGIN = gql`
    mutation LoginUser($input: User!) {
        loginUser(input: $input) {
            Id
            Email
            Username
        }
    }
`;
