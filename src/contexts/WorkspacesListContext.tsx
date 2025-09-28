import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';

import type { Workspace, WorkspaceId } from '@/types/workspaces';
import { useApolloClient } from '@apollo/client';
import { getWorkspacesQuery } from '@/graphql/workspaces';

interface WorkspacesListContextValue {
    workspacesList: Workspace[];
    setWorkspacesList(list: Workspace[]): void;
    activeWorkspaceId: WorkspaceId | null;
    setActiveWorkspaceId(id: WorkspaceId | null): void;
    refetch(): void;
}

export const WorkspacesListContext = createContext<WorkspacesListContextValue | null>(null);

export function WorkspacesListProvider({ children }: { children: ReactNode }) {
    const [workspacesList, setWorkspacesList] = useState<Workspace[]>([]);
    const isLoading = useRef(false);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<WorkspaceId | null>(null);
    const client = useApolloClient();

    const fetchData = useCallback(async () => {
        if (isLoading.current) {
            return;
        }
        try {
            isLoading.current = true;
            const list = await getWorkspacesQuery(client);
            setWorkspacesList(list);
        } catch (err: any) {
            console.error(err);
        } finally {
            isLoading.current = false;
        }
    }, [ client, setWorkspacesList ]);

    const refetch = () => {
        fetchData();
    };

    // Application start
    useEffect(() => {
        fetchData();
    }, [ ]);

    return (
        <WorkspacesListContext.Provider
            value={{
                workspacesList,
                setWorkspacesList,
                activeWorkspaceId,
                setActiveWorkspaceId,
                refetch,
            }}
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
