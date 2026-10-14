import { createContext, PropsWithChildren, useContext } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';

import { Workspace } from '@/types/workspaces';
import { Channel } from '@/types/channels';
import { GET_WORKSPACE_CHANNELS } from '@/graphql/channels';

interface WorkspaceChannelsListContextValue {
    workspace: Workspace;
    channels: Channel[];
}

const WorkspaceChannelsListContext = createContext<WorkspaceChannelsListContextValue | null>(null);

type WorkspaceChannelsListProviderProps = {
    workspace: Workspace;
} & PropsWithChildren;

export function WorkspaceChannelsListProvider({ workspace, children }: WorkspaceChannelsListProviderProps) {
    const { data } = useSuspenseQuery(GET_WORKSPACE_CHANNELS, {
        variables: { workspaceId: workspace.id },
        fetchPolicy: 'cache-and-network',
    });

    return (
        <WorkspaceChannelsListContext.Provider
            value={{ channels: data?.channels?.workspaceChannelList, workspace }}
        >
            {children}
        </WorkspaceChannelsListContext.Provider>
    );
}

export function useWorkspaceChannelsList() {
    const ctx = useContext(WorkspaceChannelsListContext);
    if (!ctx) {
        throw new Error('useWorkspaceChannelsList must be used within a WorkspaceChannelsListProvider');
    }
    return ctx;
}
