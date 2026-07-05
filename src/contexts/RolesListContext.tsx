import { createContext, PropsWithChildren, startTransition, useContext, useEffect } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';

import { Role } from '@/types/roles';
import { GET_ROLES_QUERY } from '@/graphql/roles';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { WebSocketEventType } from '@/communication/WebSocketEventEmitter';

interface RolesListContextValue {
    roles: Role[];
    refetch: () => void;
}

const RolesListContext = createContext<RolesListContextValue | null>(null);

export function RolesListProvider({ children }: PropsWithChildren) {
    const { data, refetch } = useSuspenseQuery(GET_ROLES_QUERY, {
        fetchPolicy: 'no-cache',
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

        const onRolesChanged = () => {
            startTransition(async () => {
                await refetch();
            });
        };

        eventEmitter.addEventListener(WebSocketEventType.NEW_ROLE, onRolesChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_ROLE, onRolesChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_ROLE, onRolesChanged, { signal });

        return () => controller.abort();
    }, [eventEmitter, refetch]);

    return (
        <RolesListContext.Provider
            value={{ roles: data.roles.list, refetch: handleRefresh }}
        >
            {children}
        </RolesListContext.Provider>
    );
}

export function useRolesList() {
    const ctx = useContext(RolesListContext);
    if (!ctx) {
        throw new Error('useRolesList must be used within an RolesListProvider');
    }
    return ctx;
}
