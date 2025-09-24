import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Workspace } from '@/types/workspaces';
import { useApolloClient } from '@apollo/client';
import { GET_WORKSPACES_QUERY } from '@/graphql/workspaces';

interface WorkspacesListContextValue {
    workspaces: Workspace[];
}

const WorkspacesListContext = createContext<WorkspacesListContextValue | null>(null);

export function WorkspacesListProvider({ children }: { children: ReactNode }) {
    const [wsList, setWs] = useState({
        workspaces: { list: [] }
    });
    const client = useApolloClient();

    // Application start
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: ws } = await client.query({
                    query: GET_WORKSPACES_QUERY,
                });

                setWs(ws as any);
            } catch (err: any) {
                console.error(err);
                // setError(err.message);
                // setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <WorkspacesListContext.Provider
            value={{ workspaces: wsList.workspaces.list }}
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
