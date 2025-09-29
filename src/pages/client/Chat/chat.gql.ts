import { ApolloClient, gql } from '@apollo/client';

export const addChannel = async ({
    client,
    name,
    channelTypeId,
    workspaceId,
}: {
    client: ApolloClient<object>,
    name: string,
    channelTypeId: string,
    workspaceId: string,
}): Promise<{
    id: string;
    name: string;
    channelTypeId: string;
    workspaceId: string;
    createdAt: string;
    updatedAt: string;
}> => {
    try {
        const { data } = await client.mutate({
            mutation: gql`
                mutation AddChannel(
                    $name: String!
                    $channelTypeId: String!
                    $workspaceId: String!
                ) {
                    channels {
                        addChannel(channelDto: {
                            name: $name
                            channelTypeId: $channelTypeId
                            workspaceId: $workspaceId
                        }) {
                            id
                            name
                            channelTypeId
                            workspaceId
                            createdAt
                            updatedAt
                        }
                    }
                }
            `,
            variables: { name, channelTypeId, workspaceId },
        });

        const channel = data?.channels?.addChannel;

        if (!channel?.id || !channel?.name) {
            throw new Error('Invalid addChannel response');
        }

        return channel;
    } catch (error) {
        throw new Error(`Adding channel failed: ${(error as Error).message}`);
    }
};
