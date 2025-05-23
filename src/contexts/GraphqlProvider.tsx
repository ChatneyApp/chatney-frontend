import {PropsWithChildren} from 'react';
import {ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';


const httpLink = new HttpLink({
    uri: 'http://localhost:8080/query'
});

export const GraphqlProvider = ({children}: PropsWithChildren) => {
    const authMiddleware = setContext((_, previousContext) => {
        const {headers = {}} = previousContext;
        return ({
            ...previousContext,
            headers: {
                ...headers,
                auth: '123',
            },
        });
    })
    const client = new ApolloClient({
        link: from([authMiddleware, httpLink]),
        cache: new InMemoryCache(),
    });

    return (
        <ApolloProvider client={client}>{children}</ApolloProvider>
    );
};
