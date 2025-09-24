import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
    mutation RegisterUser($input: CreateUserDTO!) {
        CreateUser(input: $input) {
            Id
            Email
            Username
        }
    }
`;

export const LOGIN = gql`
    mutation Login($login: String!, $password: String!) {
        users {
            login(login: $login, password: $password) {
                id
                token
            }
        }
    }
`;

export const GET_USER_BY_ID = gql`
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
`;
