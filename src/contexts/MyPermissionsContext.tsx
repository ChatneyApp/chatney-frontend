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
const refetchEvents: WebSocketEventType[] = [
    'newRole',
    'updatedRole',
    'deletedRole',
    'newUserRole',
    'deletedUserRole',
    'roleAclChanged',
    'roleAclDeleted',
    'userAclChanged',
    'userAclDeleted',
    'newChannel',
    'updatedChannel',
    'deletedChannel',
    'newChannelType',
    'updatedChannelType',
    'deletedChannelType',
    'newWorkspace',
    'updatedWorkspace',
    'deletedWorkspace',
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
