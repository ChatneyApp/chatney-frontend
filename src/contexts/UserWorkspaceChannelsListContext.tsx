import { createContext, PropsWithChildren, startTransition, useContext } from 'react';
import { useSuspenseQuery } from '@apollo/client';

import { Workspace } from '@/types/workspaces';
import { Channel } from '@/types/channels';
import { GET_WORKSPACE_CHANNELS_QUERY } from '@/graphql/channels';

interface UserWorkspaceChannelsListContextValue {
    workspace: Workspace;
    channels: Channel[];
    refetch: () => void;
}

const UserWorkspaceChannelsListContext = createContext<UserWorkspaceChannelsListContextValue | null>(null);

type UserWorkspaceChannelsListProviderProps = {
    workspace: Workspace;
} & PropsWithChildren;

export function UserWorkspaceChannelsListContextProvider({ workspace, children }: UserWorkspaceChannelsListProviderProps) {
    const { data, refetch } = useSuspenseQuery(GET_WORKSPACE_CHANNELS_QUERY, {
        fetchPolicy: 'no-cache',
        variables: {
            workspaceId: workspace.id,
        },
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch();
        });
    };

    return (
        <UserWorkspaceChannelsListContext.Provider
            value={{ channels: data?.channels?.workspaceChannelList, workspace, refetch: handleRefresh }}
        >
            {children}
        </UserWorkspaceChannelsListContext.Provider>
    );
}

export function useUserWorkspaceChannelsList() {
    const ctx = useContext(UserWorkspaceChannelsListContext);
    if (!ctx) {
        throw new Error('useUserWorkspaceChannelsList must be used within a UserWorkspaceChannelsListContextProvider');
    }
    return ctx;
}
