import { createContext, PropsWithChildren, startTransition, useContext, useEffect } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';

import { ChannelType } from '@/types/channelTypes';
import { GET_CHANNEL_TYPES_QUERY } from '@/graphql/channelTypes';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { WebSocketEventType } from '@/communication/WebSocketEventEmitter';

interface ChannelTypesListContextValue {
    channelTypes: ChannelType[];
    refetch: () => void;
}

export const ChannelTypesListContext = createContext<ChannelTypesListContextValue | null>(null);

export function ChannelTypesListProvider({ children }: PropsWithChildren) {
    const { data, refetch } = useSuspenseQuery(GET_CHANNEL_TYPES_QUERY, {
        fetchPolicy: 'cache-and-network',
    });
    const { eventEmitter } = useWebsocket();

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch();
        });
    };

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const onChannelTypesChanged = () => {
            startTransition(async () => {
                await refetch();
            });
        };

        eventEmitter.addEventListener(WebSocketEventType.NEW_CHANNEL_TYPE, onChannelTypesChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_CHANNEL_TYPE, onChannelTypesChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_CHANNEL_TYPE, onChannelTypesChanged, { signal });

        return () => controller.abort();
    }, [eventEmitter, refetch]);

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
