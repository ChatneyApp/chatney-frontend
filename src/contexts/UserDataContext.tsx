import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { User } from '@/types/users';
import { useNavigate } from 'react-router';
import { getUserById } from '@/graphql/users';

interface UserDataContextValue {
    userData: User | null;
}

const UserDataListContext = createContext<UserDataContextValue | null>(null);

export function UserDataProvider({ children }: { children: ReactNode }) {
    const [ data, setData ] = useState<User | null>(null);

    const client = useApolloClient();
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            const id = localStorage.getItem('userId');

            if (!id) {
                throw new Error("User Id is not valid");
            }

            try {
                const response = await getUserById({ client, id });
                setData(response);
            } catch (error) {
                console.error('Error during login:', error);
                navigate('/client', { replace: true });
            }
        })();
    }, [ client, navigate ]);

    if (!data) {
        return null; // or a loading spinner
    }

    return (
        <UserDataListContext.Provider
            value={{ userData: data }}
        >
            {children}
        </UserDataListContext.Provider>
    );
}

export function useUserData() {
    const ctx = useContext(UserDataListContext);
    if (!ctx) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return ctx;
}
