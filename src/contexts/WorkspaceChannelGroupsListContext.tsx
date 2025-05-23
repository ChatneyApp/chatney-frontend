import {createContext, PropsWithChildren, startTransition, useContext} from 'react';
import {useSuspenseQuery} from '@apollo/client';

import {Workspace} from '@/types/workspaces';
import {ChannelGroup} from '@/types/channelGroups';
import {GET_WORKSPACE_CHANNEL_GROUPS_QUERY} from '@/graphql/channelGroups';

interface WorkspaceChannelGroupsListContextValue {
    workspace: Workspace;
    channelGroups: ChannelGroup[];
    refetch: () => void;
}

const WorkspaceChannelGroupsListContext = createContext<WorkspaceChannelGroupsListContextValue | null>(null);

type WorkspaceChannelGroupsListProviderProps = {
    workspace: Workspace;
} & PropsWithChildren;

export function WorkspaceChannelGroupsListProvider({workspace, children}: WorkspaceChannelGroupsListProviderProps) {
    const {data, refetch} = useSuspenseQuery(GET_WORKSPACE_CHANNEL_GROUPS_QUERY, {
        variables: {workspaceId: workspace.Id},
        fetchPolicy: 'cache-and-network',
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch(); // Triggers a network request and re‐suspends if fetchPolicy dictates
        });
    };

    return (
        <WorkspaceChannelGroupsListContext.Provider
            value={{channelGroups: data.listChannelGroups, workspace, refetch: handleRefresh}}
        >
            {children}
        </WorkspaceChannelGroupsListContext.Provider>
    );
}

export function useWorkspaceChannelGroupsList() {
    const ctx = useContext(WorkspaceChannelGroupsListContext);
    if (!ctx) {
        throw new Error('useWorkspaceChannelGroupsList must be used within a WorkspacesListProvider');
    }
    return ctx;
}
