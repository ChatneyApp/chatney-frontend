import { PropsWithChildren } from 'react';
import { ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const httpLink = new HttpLink({
    uri: 'http://localhost:3001/query'
});


import { onError } from '@apollo/client/link/error';
import { userAuthTokenName } from '@/infra/consts';

const errorLink = onError(({ graphQLErrors, networkError }) => {
    const isUnauthorized =
        (graphQLErrors &&
            graphQLErrors.some(err => err.extensions?.code === "AUTH_NOT_AUTHENTICATED")) ||
        (networkError && 'statusCode' in networkError && networkError.statusCode === 401);

    const currentPath = window.location.pathname;

    if (isUnauthorized && currentPath !== '/client/login') {
        // Clear any invalid token
        localStorage.removeItem(userAuthTokenName);

        // Redirect to login
        window.location.href = '/client/login'; // Adjust this to your actual login route
    }
});


export const GraphqlProvider = ({ children }: PropsWithChildren) => {
    const authMiddleware = setContext((_, previousContext) => {
        const { headers = {} } = previousContext;
        const userToken = localStorage.getItem(userAuthTokenName);
        const authHeaders = userToken ? {
            Authorization: `Bearer ${userToken}`,
        } : {};

        return ({
            ...previousContext,
            headers: {
                ...headers,
                ...authHeaders,
            },
        });
    })
    const client = new ApolloClient({
        link: from([errorLink, authMiddleware, httpLink]),
        cache: new InMemoryCache(),
    });

    return (
        <ApolloProvider client={client}>{children}</ApolloProvider>
    );
};
