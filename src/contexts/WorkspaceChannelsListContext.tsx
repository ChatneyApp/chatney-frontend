import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { skipToken, useApolloClient, useQuery } from '@apollo/client/react';

import { Channel } from '@/types/channels';
import { WorkspacesListContext } from './WorkspacesListContext';
import { GET_WORKSPACE_CHANNELS, patchChannelInCache, removeChannelFromCache } from '@/graphql/channels';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { ChannelDeletedPayload, ChannelPayload, WebSocketEvent, WebSocketEventType } from '@/communication/WebSocketEventEmitter';

interface WorkspaceChannelsListContextValue {
    channels: Channel[];
    /** False until the active workspace's channels are known (the first request is in flight). */
    loaded: boolean;
}

export const WorkspaceChannelsListContext = createContext<WorkspaceChannelsListContextValue>(null as unknown as WorkspaceChannelsListContextValue);

const noChannels: Channel[] = [];

export function WorkspaceChannelsListProvider({ children }: PropsWithChildren) {
    const { activeWorkspaceId } = useContext(WorkspacesListContext);
    const { cache } = useApolloClient();
    const { eventEmitter } = useWebsocket();

    // The list lives in the Apollo cache: it renders from there at once and is re-checked against the server in the background.
    const { data, previousData, loading, refetch } = useQuery(
        GET_WORKSPACE_CHANNELS,
        activeWorkspaceId === null
            ? skipToken
            : { variables: { workspaceId: activeWorkspaceId }, fetchPolicy: 'cache-and-network' },
    );
    // While another workspace is loading, keep showing the previous list.
    const channels = (data ?? previousData)?.channels.workspaceChannelList ?? noChannels;
    // `data` is only set for the current workspace; a failed request counts as loaded, with no channels.
    const loaded = data !== undefined || !loading;

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const onChannelCreated = (event: WebSocketEvent) => {
            const channel = event.payload as ChannelPayload;
            if (channel.isDm || activeWorkspaceId === null || channel.workspaceId !== activeWorkspaceId) {
                return;
            }
            if (channels.some(listed => listed.id === channel.id)) {
                return;
            }
            // The event reaches every user whatever their permissions, so ask the server whether the channel is listed for this one.
            refetch().catch(() => {
                /* swallow error */
            });
        };

        const onChannelUpdated = (event: WebSocketEvent) => {
            const channel = event.payload as ChannelPayload;
            if (!channel.isDm) {
                patchChannelInCache(cache, channel);
            }
        };

        const onChannelDeleted = (event: WebSocketEvent) => {
            const channel = event.payload as ChannelDeletedPayload;
            if (!channel.isDm) {
                removeChannelFromCache(cache, channel.id);
            }
        };

        eventEmitter.addEventListener(WebSocketEventType.NEW_CHANNEL, onChannelCreated, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_CHANNEL, onChannelUpdated, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_CHANNEL, onChannelDeleted, { signal });

        return () => controller.abort();
    }, [eventEmitter, cache, refetch, activeWorkspaceId, channels]);

    return (
        <WorkspaceChannelsListContext.Provider value={{ channels, loaded }}>
            {children}
        </WorkspaceChannelsListContext.Provider>
    );
}

export function useWorkspaceChannelsList() {
    const ctx = useContext(WorkspaceChannelsListContext);
    if (!ctx) {
        throw new Error('useWorkspaceChannelsList must be used within a WorkspacesListProvider');
    }
    return ctx;
}
