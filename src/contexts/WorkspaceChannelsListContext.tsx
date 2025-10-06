import { createContext, ReactNode, startTransition, useContext, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { Channel } from '@/types/channels';
import { WorkspacesListContext } from './WorkspacesListContext';
import { getWorkspaceChannels } from '@/graphql/channels';
import { ChannelList } from '@/pages/client/Chat/ChannelsList';

interface WorkspaceChannelsListContextValue {
    channels: Channel[];
    activeChannel: Channel;
    refetch: (channelId?: string) => void;
    setActiveChannel: (ch: Channel) => void
}

const WorkspaceChannelsListContext = createContext<WorkspaceChannelsListContextValue>(null as unknown as WorkspaceChannelsListContextValue);

export function WorkspaceChannelsListProvider({ children }: { children: ReactNode }) {
    const { activeWorkspaceId } = useContext(WorkspacesListContext);
    const [channels, setChannels] = useState<Channel[]>([]);
    const [activeChannel, setActiveChannel] = useState<Channel>(null as unknown as Channel);

    const client = useApolloClient();

    const handleRefresh = (channelId?: string) => {
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
    };

    useEffect(() => {
        if (activeWorkspaceId === null) {
            return;
        }
        handleRefresh();
    }, [activeWorkspaceId]);

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
