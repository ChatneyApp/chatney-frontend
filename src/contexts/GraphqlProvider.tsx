import { PropsWithChildren } from 'react';
import { ApolloClient, CombinedGraphQLErrors, from, InMemoryCache, ServerError } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import UploadHttpLink from 'apollo-upload-client/UploadHttpLink.mjs';

import { loginPageUrl, userAuthTokenName } from '@/infra/consts';

const authLink = new SetContextLink((previousContext) => {
    const userToken = localStorage.getItem(userAuthTokenName);

    return {
        headers: {
            ...previousContext.headers,
            ...(userToken
                ? { Authorization: `Bearer ${userToken}` }
                : {}),
        },
    };
});

const uploadLink = new UploadHttpLink({
    uri: import.meta.env.VITE_API_URL,
    headers: {
        'GraphQL-preflight': '1',
    },
});

const errorLink = new ErrorLink(({ error }) => {
    const isUnauthorizedGraphQl =
        CombinedGraphQLErrors.is(error) &&
        error.errors.some(
            (err) =>
                err.extensions?.code === 'AUTH_NOT_AUTHENTICATED' ||
                err.extensions?.code === 'UNAUTHENTICATED'
        );

    const isUnauthorizedHttp =
        ServerError.is(error) && error.statusCode === 401;

    const isUnauthorized = isUnauthorizedGraphQl || isUnauthorizedHttp;
    const currentPath = window.location.pathname;

    if (isUnauthorized && currentPath !== loginPageUrl) {
        localStorage.removeItem(userAuthTokenName);
        window.location.assign(loginPageUrl);
    }
});

const client = new ApolloClient({
    link: from([errorLink, authLink, uploadLink]),
    cache: new InMemoryCache(),
});

export const GraphqlProvider = ({ children }: PropsWithChildren) => {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
