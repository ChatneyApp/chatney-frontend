import { GET_WORKSPACES_QUERY } from '@/graphql/workspaces';
import { useApolloClient } from '@apollo/client';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

const UserContext = createContext({});

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState({});
    const client = useApolloClient();

    // Application start
    useEffect(() => {
        const fetchStartupData = async () => {
            try {
                // 1. Get Current User
                const { data: userData } = await client.query({
                    query: GET_WORKSPACES_QUERY,
                });

                console.log(userData);

                // // 2. Get Workspaces
                // const { data: workspacesData } = await client.query({
                //     query: GET_WORKSPACES_QUERY,
                //     variables: { userId },
                // });

                // const firstWorkspaceId = workspacesData.getWorkspacesList[0]?.Id;

                // // 3. Get Workspace Settings
                // if (firstWorkspaceId) {
                //     const { data: settingsData } = await client.query({
                //         query: GET_WORKSPACE_SETTINGS,
                //         variables: { workspaceId: firstWorkspaceId },
                //     });

                //     console.log('Settings:', settingsData);
                // }

                //setLoading(false);
            } catch (err: any) {
                console.error(err);
                // setError(err.message);
                // setLoading(false);
            }
        };

        // fetchStartupData();
    }, []);


    return (
        <UserContext.Provider value={{
            user,
            setContext: setUser
        }} >
            {children}
        </UserContext.Provider >
    );
};

export const UseUser = () => useContext(UserContext);
