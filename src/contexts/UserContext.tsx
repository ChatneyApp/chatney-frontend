import { GET_USER_BY_ID } from '@/graphql/users';
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
    const [userCtx, setUser] = useState<UserContextData | null>({
        user: null, logout: logoutFunction
    });
    const client = useApolloClient();

    // Application start
    useEffect(() => {
        const fetchStartupData = async () => {
            try {
                const userid = localStorage.getItem(userAuthId);

                if (!userid) {
                    window.location.href = loginPageUrl;
                    return;
                }

                const { data: userData } = await client.query({
                    query: GET_USER_BY_ID,
                    variables: {
                        id: userid
                    },
                    fetchPolicy: 'network-only', // Optional: avoids cache
                });

                if (userData) {
                    setUser({ user: userData.users.userById, logout: logoutFunction });
                    return;
                } else {
                    window.location.href = loginPageUrl;
                    return;
                }

            } catch (err: any) {
                console.error(err);
                window.location.href = loginPageUrl;
            }
        };

        fetchStartupData();
    }, [userCtx]);

    return (
        <UserContext.Provider value={userCtx} >
            {userCtx?.user && children}
        </UserContext.Provider >
    );
};

export const UseUser = () => useContext(UserContext);
