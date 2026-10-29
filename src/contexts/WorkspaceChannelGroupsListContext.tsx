import { createContext, PropsWithChildren, useContext } from 'react';
import { skipToken, useQuery } from '@apollo/client/react';

import { ChannelGroup } from '@/types/channelGroups';
import { GET_WORKSPACE_CHANNEL_GROUPS } from '@/graphql/channelGroups';
import { WorkspacesListContext } from './WorkspacesListContext';

interface WorkspaceChannelGroupsListContextValue {
    channelGroups: ChannelGroup[];
    /** False until the active workspace's groups are known (the first request is in flight). */
    loaded: boolean;
}

export const WorkspaceChannelGroupsListContext = createContext<WorkspaceChannelGroupsListContextValue>(
    null as unknown as WorkspaceChannelGroupsListContextValue,
);

const noChannelGroups: ChannelGroup[] = [];

export function WorkspaceChannelGroupsListProvider({ children }: PropsWithChildren) {
    const { activeWorkspaceId } = useContext(WorkspacesListContext);

    // The backend sends no WebSocket events for channel groups, so changes show up on the next request
    // (switching workspaces or reloading the page).
    const { data, previousData, loading } = useQuery(
        GET_WORKSPACE_CHANNEL_GROUPS,
        activeWorkspaceId === null
            ? skipToken
            : { variables: { workspaceId: activeWorkspaceId }, fetchPolicy: 'cache-and-network' },
    );
    // While another workspace is loading, keep showing the previous list.
    const channelGroups = (data ?? previousData)?.channels.workspaceChannelGroupList ?? noChannelGroups;
    // `data` is only set for the current workspace; a failed request counts as loaded, with no groups.
    const loaded = data !== undefined || !loading;

    return (
        <WorkspaceChannelGroupsListContext.Provider value={{ channelGroups, loaded }}>
            {children}
        </WorkspaceChannelGroupsListContext.Provider>
    );
}

export function useWorkspaceChannelGroupsList() {
    const ctx = useContext(WorkspaceChannelGroupsListContext);
    if (!ctx) {
        throw new Error('useWorkspaceChannelGroupsList must be used within a WorkspaceChannelGroupsListProvider');
    }
    return ctx;
}
