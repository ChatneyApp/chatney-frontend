import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';

import { Channel } from '@/types/channels';
import { getDirectMessages } from '@/graphql/channels';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { WebSocketEvent, WebSocketEventType } from '@/communication/WebSocketEventEmitter';

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

        const onDirectMessagesChanged = (event: WebSocketEvent) => {
            const payload = event.payload;
            if ('isDm' in payload && payload.isDm !== true) {
                return;
            }
            if (!('isDm' in payload) && 'workspaceId' in payload && payload.workspaceId != null) {
                return;
            }
            void handleRefresh();
        };

        eventEmitter.addEventListener(WebSocketEventType.NEW_CHANNEL, onDirectMessagesChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_CHANNEL, onDirectMessagesChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_CHANNEL, onDirectMessagesChanged, { signal });

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
