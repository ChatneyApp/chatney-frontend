import { createContext, PropsWithChildren, startTransition, useContext } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';

import { Workspace } from '@/types/workspaces';
import { Channel } from '@/types/channels';
import { type GetChannelsListResponse, GetWorkspaceChannelsQuery } from '@/graphql/channels';

interface WorkspaceChannelsListContextValue {
    workspace: Workspace;
    channels: Channel[];
    refetch: () => void;
}

const WorkspaceChannelsListContext = createContext<WorkspaceChannelsListContextValue | null>(null);

type WorkspaceChannelsListProviderProps = {
    workspace: Workspace;
} & PropsWithChildren;

export function WorkspaceChannelsListProvider({ workspace, children }: WorkspaceChannelsListProviderProps) {
    const { data, refetch } = useSuspenseQuery<GetChannelsListResponse>(GetWorkspaceChannelsQuery, {
        variables: { workspaceId: workspace.id },
        fetchPolicy: 'no-cache',
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch();
        });
    };

    return (
        <WorkspaceChannelsListContext.Provider
            value={{ channels: data?.channels?.workspaceChannelList, workspace, refetch: handleRefresh }}
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
