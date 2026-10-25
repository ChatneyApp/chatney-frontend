import { createContext, PropsWithChildren, startTransition, useContext, useEffect, useMemo } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';

import { GET_MY_PERMISSIONS } from '@/graphql/permissions';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { WebSocketEventType } from '@/communication/WebSocketEventEmitter';
import { ChannelPermissions, DM_CHANNEL_PERMISSIONS, toChannelPermissions } from '@/helpers/channelPermissions';
import { Permission } from '@/types/acls';
import { ChannelId } from '@/types/channels';

interface MyPermissionsContextValue {
    channelPermissions: Map<ChannelId, Permission[]>;
}

const MyPermissionsContext = createContext<MyPermissionsContextValue | null>(null);

// effective permissions are resolved through the whole workspace → channel type → channel hierarchy
const refetchEvents = [
    WebSocketEventType.NEW_ROLE,
    WebSocketEventType.UPDATED_ROLE,
    WebSocketEventType.DELETED_ROLE,
    WebSocketEventType.NEW_USER_ROLE,
    WebSocketEventType.UPDATED_USER_ROLE,
    WebSocketEventType.DELETED_USER_ROLE,
    WebSocketEventType.ROLE_ACL_CHANGED,
    WebSocketEventType.ROLE_ACL_DELETED,
    WebSocketEventType.USER_ACL_CHANGED,
    WebSocketEventType.USER_ACL_DELETED,
    WebSocketEventType.NEW_CHANNEL,
    WebSocketEventType.UPDATED_CHANNEL,
    WebSocketEventType.DELETED_CHANNEL,
    WebSocketEventType.NEW_CHANNEL_TYPE,
    WebSocketEventType.UPDATED_CHANNEL_TYPE,
    WebSocketEventType.DELETED_CHANNEL_TYPE,
    WebSocketEventType.NEW_WORKSPACE,
    WebSocketEventType.UPDATED_WORKSPACE,
    WebSocketEventType.DELETED_WORKSPACE,
];

const dmChannelPermissions = toChannelPermissions(DM_CHANNEL_PERMISSIONS);

export function MyPermissionsProvider({ children }: PropsWithChildren) {
    const { data, refetch } = useSuspenseQuery(GET_MY_PERMISSIONS, {
        fetchPolicy: 'cache-and-network',
    });
    const { eventEmitter } = useWebsocket();

    const channelPermissions = useMemo(
        () => new Map(data.users.myPermissions.channels.map(channel => [channel.id, channel.permissions])),
        [data],
    );

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const onPermissionsChanged = () => {
            startTransition(async () => {
                await refetch();
            });
        };

        refetchEvents.forEach(eventType => {
            eventEmitter.addEventListener(eventType, onPermissionsChanged, { signal });
        });

        return () => controller.abort();
    }, [eventEmitter, refetch]);

    return (
        <MyPermissionsContext.Provider value={{ channelPermissions }}>
            {children}
        </MyPermissionsContext.Provider>
    );
}

export function useChannelPermissions(channelId: ChannelId, isDm: boolean): ChannelPermissions {
    const ctx = useContext(MyPermissionsContext);
    if (!ctx) {
        throw new Error('useChannelPermissions must be used within a MyPermissionsProvider');
    }

    const permissions = isDm ? null : ctx.channelPermissions.get(channelId);
    return useMemo(
        () => isDm ? dmChannelPermissions : toChannelPermissions(permissions ?? []),
        [isDm, permissions],
    );
}
