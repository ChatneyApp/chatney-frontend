import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';

import { Channel } from '@/types/channels';
import { getDirectMessages } from '@/graphql/channels';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { ChannelChangedEvent } from '@/communication/WebSocketEventEmitter';

interface DirectMessagesListContextValue {
    directMessages: Channel[];
    refetch: () => Promise<void>;
}

export const DirectMessagesListContext = createContext<DirectMessagesListContextValue | null>(null);

export function DirectMessagesListProvider({ children }: PropsWithChildren) {
    const [directMessages, setDirectMessages] = useState<Channel[]>([]);
    const client = useApolloClient();
    const { eventEmitter } = useWebsocket();

    const handleRefresh = useCallback(async () => {
        try {
            const list = await getDirectMessages(client);
            setDirectMessages(list);
        } catch (_error) {
            /* swallow error */
        }
    }, [client]);

    useEffect(() => {
        void handleRefresh();
    }, [handleRefresh]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const onDirectMessagesChanged = (event: ChannelChangedEvent) => {
            if (event.payload.isDm) {
                void handleRefresh();
            }
        };

        eventEmitter.addEventListener('newChannel', onDirectMessagesChanged, { signal });
        eventEmitter.addEventListener('updatedChannel', onDirectMessagesChanged, { signal });
        eventEmitter.addEventListener('deletedChannel', onDirectMessagesChanged, { signal });

        return () => controller.abort();
    }, [eventEmitter, handleRefresh]);

    return (
        <DirectMessagesListContext.Provider value={{ directMessages, refetch: handleRefresh }}>
            {children}
        </DirectMessagesListContext.Provider>
    );
}

export function useDirectMessagesList() {
    const ctx = useContext(DirectMessagesListContext);
    if (!ctx) {
        throw new Error('useDirectMessagesList must be used within a DirectMessagesListProvider');
    }
    return ctx;
}
