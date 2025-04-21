import {createContext, ReactNode, startTransition, useContext} from 'react';
import {useSuspenseQuery} from '@apollo/client';

import {Role} from '@/types/roles';
import {GET_ROLES_QUERY} from '@/graphql/roles';

interface RolesListContextValue {
    roles: Role[];
    refetch: () => void;
}

const RolesListContext = createContext<RolesListContextValue | null>(null);

export function RolesListProvider({ children }: { children: ReactNode }) {
    const { data, refetch } = useSuspenseQuery(GET_ROLES_QUERY, {
        fetchPolicy: 'cache-and-network',
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch(); // Triggers a network request and re‐suspends if fetchPolicy dictates
        });
    };

    return (
        <RolesListContext.Provider
            value={{ roles: data.getRolesList, refetch: handleRefresh }}
        >
            {children}
        </RolesListContext.Provider>
    );
}

export function useRolesList() {
    const ctx = useContext(RolesListContext);
    if (!ctx) {
        throw new Error('useRolesList must be used within an RolesListProvider');
    }
    return ctx;
}
