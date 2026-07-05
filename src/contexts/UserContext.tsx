import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { getUserById } from '@/graphql/users';
import { loginPageUrl, userAuthId, userAuthTokenName } from '@/infra/consts';
import { User } from '@/types/users';

const UserContext = createContext<UserContextData | null>(null);

export type UserContextData = {
    user: User | null;
    logout: typeof logoutFunction;
    refreshUser: () => Promise<void>;
}

const logoutFunction = () => {
    localStorage.removeItem(userAuthId);
    localStorage.removeItem(userAuthTokenName);
    window.location.reload()
}

export const UserProvider = ({ children }: PropsWithChildren) => {
    const apollo = useApolloClient();
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    const refreshUser = useCallback(async () => {
        const userid = localStorage.getItem(userAuthId);
        if (!userid) {
            window.location.href = loginPageUrl;
            return;
        }

        const userData = await getUserById(apollo, userid);
        setUser(userData);
    }, [apollo]);

    useEffect(() => {
        const fetchStartupData = async () => {
            try {
                await refreshUser();
            } catch (err) {
                console.error(err);
                window.location.href = loginPageUrl;
            } finally {
                setIsReady(true);
            }
        };

        fetchStartupData();
    }, [refreshUser]);

    const value = useMemo<UserContextData>(() => ({
        user,
        logout: logoutFunction,
        refreshUser,
    }), [user, refreshUser]);

    if (!isReady) {
        return null;
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
