import { createContext, PropsWithChildren, startTransition, useCallback, useContext, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';

import { Channel, ChannelId } from '@/types/channels';
import { WorkspacesListContext } from './WorkspacesListContext';
import { getWorkspaceChannels } from '@/graphql/channels';

interface WorkspaceChannelsListContextValue {
    channels: Channel[];
    activeChannel: Channel;
    refetch: (channelId?: ChannelId) => void;
    setActiveChannel: (ch: Channel) => void
}

export const WorkspaceChannelsListContext = createContext<WorkspaceChannelsListContextValue>(null as unknown as WorkspaceChannelsListContextValue);

export function WorkspaceChannelsListProvider({ children }: PropsWithChildren) {
    const { activeWorkspaceId } = useContext(WorkspacesListContext);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [activeChannel, setActiveChannel] = useState<Channel>(null as unknown as Channel);

    const client = useApolloClient();

    const handleRefresh = useCallback((channelId?: ChannelId) => {
        startTransition(async () => {
            if (activeWorkspaceId === null) {
                return;
            }
            try {
                const channelsList = await getWorkspaceChannels({ client, workspaceId: activeWorkspaceId });
                setChannels(channelsList);
                let localActiveChannel = channelsList[0];
                if (channelId) {
                    localActiveChannel = channelsList.find(c => c.id === channelId) ?? localActiveChannel;
                }
                setActiveChannel(localActiveChannel);
            } catch (_error) {
                /* swallow error */
            }
        });
    }, [activeWorkspaceId, client]);

    useEffect(() => {
        if (activeWorkspaceId === null) {
            return;
        }
        handleRefresh();
    }, [activeWorkspaceId, handleRefresh]);

    return (
        <WorkspaceChannelsListContext.Provider
            value={{ channels: channels, refetch: handleRefresh, activeChannel, setActiveChannel }}
        >
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
