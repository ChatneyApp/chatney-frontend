import {createContext, PropsWithChildren, startTransition, useContext} from 'react';
import {useSuspenseQuery} from '@apollo/client';

import {Workspace} from '@/types/workspaces';
import {GET_USER_WORKSPACES_QUERY} from '@/graphql/workspaces';
import {useUserData} from '@/contexts/UserDataContext';

interface UserWorkspacesListContextValue {
    workspaces: Workspace[];
    refetch: () => void;
}

const UserWorkspacesListContext = createContext<UserWorkspacesListContextValue | null>(null);

type UserWorkspacesListProviderProps = {
} & PropsWithChildren;

export function UserWorkspacesListProvider({children}: UserWorkspacesListProviderProps) {
    const {userData} = useUserData();
    const {data, refetch} = useSuspenseQuery(GET_USER_WORKSPACES_QUERY, {
        fetchPolicy: 'no-cache',
        variables: {
            userId: userData!.Id
        },
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch();
        });
    };

    return (
        <UserWorkspacesListContext.Provider
            value={{workspaces: data?.GetUserWorkspacesList, refetch: handleRefresh}}
        >
            {children}
        </UserWorkspacesListContext.Provider>
    );
}

export function useUserWorkspacesList() {
    const ctx = useContext(UserWorkspacesListContext);
    if (!ctx) {
        throw new Error('useUserWorkspacesList must be used within a UserWorkspacesListProvider');
    }
    return ctx;
}
