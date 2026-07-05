import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState, startTransition } from 'react';

import type { Workspace, WorkspaceId } from '@/types/workspaces';
import { useApolloClient } from '@apollo/client/react';
import { getWorkspacesQuery } from '@/graphql/workspaces';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { WebSocketEventType } from '@/communication/WebSocketEventEmitter';

interface WorkspacesListContextValue {
    workspacesList: Workspace[];
    setWorkspacesList(list: Workspace[]): void;
    activeWorkspaceId: WorkspaceId | null;
    setActiveWorkspaceId(id: WorkspaceId | null): void;
    refetch(): void;
}

export const WorkspacesListContext = createContext<WorkspacesListContextValue>(null as unknown as WorkspacesListContextValue);

export function WorkspacesListProvider({ children }: PropsWithChildren) {
    const [workspacesList, setWorkspacesList] = useState<Workspace[]>([]);
    const isLoading = useRef(false);
    const [activeWorkspaceId, setActiveWorkspaceId] = useState<WorkspaceId | null>(null);
    const client = useApolloClient();
    const { eventEmitter } = useWebsocket();

    const fetchData = useCallback(async () => {
        if (isLoading.current) {
            return;
        }
        try {
            isLoading.current = true;
            const list = await getWorkspacesQuery(client);
            setWorkspacesList(list);
            setActiveWorkspaceId(list?.[0]?.id ?? null);
        } catch (err) {
            console.error(err);
        } finally {
            isLoading.current = false;
        }
    }, [client, setWorkspacesList]);

    // Application start
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const onWorkspacesChanged = () => {
            startTransition(() => {
                fetchData();
            });
        };

        eventEmitter.addEventListener(WebSocketEventType.NEW_WORKSPACE, onWorkspacesChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_WORKSPACE, onWorkspacesChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_WORKSPACE, onWorkspacesChanged, { signal });

        return () => controller.abort();
    }, [eventEmitter, fetchData]);

    return (
        <WorkspacesListContext.Provider
            value={{
                workspacesList,
                setWorkspacesList,
                activeWorkspaceId,
                setActiveWorkspaceId,
                refetch: fetchData,
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
