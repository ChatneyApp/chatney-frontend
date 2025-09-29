import { createContext, ReactNode, startTransition, useContext } from 'react';
import { useSuspenseQuery } from '@apollo/client';

import { Role } from '@/types/roles';
import { GET_ROLES_QUERY } from '@/graphql/roles';

interface RolesListContextValue {
    roles: Role[];
    refetch: () => void;
}

const RolesListContext = createContext<RolesListContextValue | null>(null);

export function RolesListProvider({ children }: { children: ReactNode }) {
    const { data, refetch } = useSuspenseQuery(GET_ROLES_QUERY, {
        fetchPolicy: 'no-cache',
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch();
        });
    };

    return (
        <RolesListContext.Provider
            value={{ roles: data.roles.list, refetch: handleRefresh }}
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
