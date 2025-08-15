import {createContext, PropsWithChildren, startTransition, useContext} from 'react';
import {useSuspenseQuery} from '@apollo/client';

import {Channel} from '@/types/channels';
import {GET_CHANNEL} from '@/graphql/channels';

interface UserWorkspaceChannelsListContextValue {
    channel: Channel;
    refetch: () => void;
}

const UserChannelContext = createContext<UserWorkspaceChannelsListContextValue | null>(null);

type UserWorkspaceChannelsListProviderProps = {
    channelId: string;
} & PropsWithChildren;

export function UserChannelProvider({channelId, children}: UserWorkspaceChannelsListProviderProps) {
    const {data, refetch} = useSuspenseQuery(GET_CHANNEL, {
        fetchPolicy: 'no-cache',
        variables: {
            channelId,
        },
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch();
        });
    };

    return (
        <UserChannelContext.Provider
            value={{channel: data?.GetChannel, refetch: handleRefresh}}
        >
            {children}
        </UserChannelContext.Provider>
    );
}

export function useUserChannel() {
    const ctx = useContext(UserChannelContext);
    if (!ctx) {
        throw new Error('useUserChannel must be used within a UserChannelProvider');
    }
    return ctx;
}
