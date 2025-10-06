import { getUserById } from '@/graphql/users';
import { loginPageUrl, userAuthId, userAuthTokenName } from '@/infra/consts';
import { Workspace } from '@/types/workspaces';
import { useApolloClient } from '@apollo/client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const UserContext = createContext<UserContextData | null>(null);

export type UserContextData = {
    user: {
        id: string
        name: string
        active: boolean
        verified: boolean
        banned: boolean
        muted: boolean
        email: string
        workspaces: Workspace[]
    } | null,
    logout: typeof logoutFunction
}

const logoutFunction = () => {
    localStorage.removeItem(userAuthId);
    localStorage.removeItem(userAuthTokenName);
    window.location.reload()
}

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const apollo = useApolloClient();
    const [ userCtx, setUser ] = useState<UserContextData | null>({
        user: null, logout: logoutFunction
    });

    // Application start
    useEffect(() => {
        const fetchStartupData = async () => {
            try {
                const userid = localStorage.getItem(userAuthId);

                if (!userid) {
                    window.location.href = loginPageUrl;
                    return;
                }

                const userData = await getUserById({ client: apollo, id: userid });

                if (userData) {
                    setUser({ user: userData, logout: logoutFunction });
                    return;
                } else {
                    window.location.href = loginPageUrl;
                    return;
                }

            } catch (err) {
                console.error(err);
                window.location.href = loginPageUrl;
            }
        };

        fetchStartupData();
    }, [ ]);

    if (!userCtx) {
        return null;
    }

    return (
        <UserContext.Provider value={userCtx} >
            {children}
        </UserContext.Provider >
    );
};

export const useUser = () => useContext(UserContext);
