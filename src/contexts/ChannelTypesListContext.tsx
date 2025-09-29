import { createContext, ReactNode, startTransition, useContext } from 'react';
import { useSuspenseQuery } from '@apollo/client';

import { ChannelType } from '@/types/channelTypes';
import { GET_CHANNEL_TYPES_QUERY } from '@/graphql/channelTypes';

interface ChannelTypesListContextValue {
    channelTypes: ChannelType[];
    refetch: () => void;
}

const ChannelTypesListContext = createContext<ChannelTypesListContextValue | null>(null);

export function ChannelTypesListProvider({ children }: { children: ReactNode }) {
    const { data, refetch } = useSuspenseQuery(GET_CHANNEL_TYPES_QUERY, {
        fetchPolicy: 'cache-and-network',
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch();
        });
    };

    return (
        <ChannelTypesListContext.Provider
            value={{ channelTypes: data?.channels?.channelTypeList, refetch: handleRefresh }}
        >
            {children}
        </ChannelTypesListContext.Provider>
    );
}

export function useChannelTypesList() {
    const ctx = useContext(ChannelTypesListContext);
    if (!ctx) {
        throw new Error('useChannelTypesList must be used within a ChannelTypesListProvider');
    }
    return ctx;
}
