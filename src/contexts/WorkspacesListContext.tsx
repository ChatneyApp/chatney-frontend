import {createContext, ReactNode, startTransition, useContext} from 'react';
import {useSuspenseQuery} from '@apollo/client';

import {Workspace} from '@/types/workspaces';
import {GET_WORKSPACES_QUERY} from '@/graphql/workspaces';

interface WorkspacesListContextValue {
    workspaces: Workspace[];
    refetch: () => void;
}

const WorkspacesListContext = createContext<WorkspacesListContextValue | null>(null);

export function WorkspacesListProvider({children}: { children: ReactNode }) {
    const {data, refetch} = useSuspenseQuery(GET_WORKSPACES_QUERY, {
        fetchPolicy: 'cache-and-network',
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch(); // Triggers a network request and re‐suspends if fetchPolicy dictates
        });
    };

    return (
        <WorkspacesListContext.Provider
            value={{workspaces: data.getWorkspacesList, refetch: handleRefresh}}
        >
            {children}
        </WorkspacesListContext.Provider>
    );
}

export function useWorkspacesList() {
    const ctx = useContext(WorkspacesListContext);
    if (!ctx) {
        throw new Error('useWorkspacesList must be used within a WorkspacesListProvider');
    }
    return ctx;
}
