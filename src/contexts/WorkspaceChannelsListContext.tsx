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
    const { activeWorkspace } = useContext(WorkspacesListContext);
    const [channels, setChannels] = useState<Channel[]>([]);
    const client = useApolloClient();

    const handleRefresh = () => {
        startTransition(async () => {
            if (activeWorkspace === null) return;
            try {
                const channelsList = await getWorkspaceChannels({ client, workspaceId: activeWorkspace.id });
                setChannels(channelsList);
            } catch (error) {

            }
        });
    };

    useEffect(() => {
        if (activeWorkspace === null) return;
        console.log(activeWorkspace)
        handleRefresh();
    }, [activeWorkspace])

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
