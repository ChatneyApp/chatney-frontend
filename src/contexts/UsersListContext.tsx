import { createContext, PropsWithChildren, useContext } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';

import { GET_USERS_QUERY } from '@/graphql/adminUsers';
import { User } from '@/types/users';

interface UsersListContextValue {
    users: User[];
    refetch: () => void;
}

const UsersListContext = createContext<UsersListContextValue | null>(null);

export function UsersListProvider({ children }: PropsWithChildren) {
    const { data, refetch } = useSuspenseQuery(GET_USERS_QUERY, {
        variables: { filter: {} },
        fetchPolicy: 'no-cache',
    });

    const handleRefresh = () => {
        void refetch();
    };

    return (
        <UsersListContext.Provider
            value={{ users: data.users.list, refetch: handleRefresh }}
        >
            {children}
        </UsersListContext.Provider>
    );
}

export function useUsersList() {
    const ctx = useContext(UsersListContext);
    if (!ctx) {
        throw new Error('useUsersList must be used within a UsersListProvider');
    }
    return ctx;
}
