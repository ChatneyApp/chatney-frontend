import {createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState} from 'react';
import { Workspace } from '@/types/workspaces';
import { useApolloClient } from '@apollo/client';
import { getWorkspacesQuery } from '@/graphql/workspaces';

interface WorkspacesListContextValue {
    workspaces: Workspace[];
    setWsList(list: Workspace[]): void;
    activeWorkspace: Workspace | null;
    setActiveWs(ws: Workspace): void;
    refetch(): void;
}

export const WorkspacesListContext = createContext<WorkspacesListContextValue | null>(null);

export function WorkspacesListProvider({ children }: { children: ReactNode }) {
    const [wsList, setWs] = useState<Workspace[]>([]);
    const isLoading = useRef(false);
    const [activeWs, setActiveWs] = useState<Workspace | null>(null);
    const client = useApolloClient();

    const fetchData = useCallback(async () => {
        console.log(client, isLoading, activeWs, wsList);
        if (isLoading.current) {
            return;
        }
        try {
            isLoading.current = true;
            const list = await getWorkspacesQuery(client);
            console.log('Fetched workspaces:', list);
            setWs(list);
        } catch (err: any) {
            console.error(err);
        } finally {
            isLoading.current = false;
        }
    }, [ client, setWs ]);

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
                workspaces: wsList,
                setWsList: setWs,
                activeWorkspace: activeWs,
                setActiveWs,
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
