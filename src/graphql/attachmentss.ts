import { ApolloClient, gql } from '@apollo/client';

type SecureUrlResponse = {
    secureUrl: string;
}

export const requestFileUpload = async (client: ApolloClient<object>): Promise<string> => {
    const GQL_MUTATION = gql`
        mutation {
            attachments {
                requestUpload {
                    secureUrl
                }
            }
        }
    `;
    try {
        const { data } = await client.mutate({
            mutation: GQL_MUTATION,
        });

        const result = data?.attachments?.requestUpload as SecureUrlResponse;

        if (!result) {
            throw new Error('Invalid deleteReaction response');
        }

        return result.secureUrl;
    } catch (error) {
        throw new Error(`Deleting reaction failed: ${(error as Error).message}`);
    }
};
