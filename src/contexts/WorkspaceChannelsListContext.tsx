import { createContext, ReactNode, startTransition, useContext, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { Channel } from '@/types/channels';
import { WorkspacesListContext } from './WorkspacesListContext';
import { getWorkspaceChannels } from '@/graphql/channels';

interface WorkspaceChannelsListContextValue {
    channels: Channel[];
    refetch: () => void;
}

const WorkspaceChannelsListContext = createContext<WorkspaceChannelsListContextValue | null>(null);

export function WorkspaceChannelsListProvider({ children }: { children: ReactNode }) {
    const { activeWorkspaceId } = useContext(WorkspacesListContext);
    const [ channels, setChannels ] = useState<Channel[]>([]);
    const client = useApolloClient();

    const handleRefresh = () => {
        startTransition(async () => {
            if (activeWorkspaceId === null) {
                return;
            }
            try {
                const channelsList = await getWorkspaceChannels({ client, workspaceId: activeWorkspaceId });
                setChannels(channelsList);
            } catch (_error) {
                /* swallow error */
            }
        });
    };

    useEffect(() => {
        if (activeWorkspaceId === null) {
            return;
        }
        console.log(activeWorkspaceId);
        handleRefresh();
    }, [ activeWorkspaceId ]);

    return (
        <WorkspaceChannelsListContext.Provider
            value={{ channels: channels, refetch: handleRefresh }}
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
