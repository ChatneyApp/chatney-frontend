import { createContext, ReactNode, startTransition, useContext } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';

import { SystemConfigValue } from '@/types/systemConfig';
import { GET_SYSTEM_CONFIG_QUERY, GetConfigListResponse } from '@/graphql/systemConfig';

interface SystemConfigContextValue {
    systemConfig: SystemConfigValue[];
    refetch: () => void;
}

const SystemConfigContext = createContext<SystemConfigContextValue | null>(null);

export function SystemConfigProvider({ children }: { children: ReactNode }) {
    const { data, refetch } = useSuspenseQuery<GetConfigListResponse>(GET_SYSTEM_CONFIG_QUERY, {
        fetchPolicy: 'no-cache',
    });

    const handleRefresh = () => {
        startTransition(async () => {
            await refetch();
        });
    };

    return (
        <SystemConfigContext.Provider
            value={{ systemConfig: data?.configs?.list, refetch: handleRefresh }}
        >
            {children}
        </SystemConfigContext.Provider>
    );
}

export function useSystemConfig() {
    const ctx = useContext(SystemConfigContext);
    if (!ctx) {
        throw new Error('useSystemConfig must be used within a SystemConfigProvider');
    }
    return ctx;
}
