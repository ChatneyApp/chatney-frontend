import {Suspense} from 'react';

import {SystemConfigProvider, useSystemConfig} from '@/contexts/SystemConfigProvider';
import {
    SystemConfigValueEditor
} from '@/pages/dashboard/components/SystemConfigValueEditor/SystemConfigValueEditor';
import {EmptyListMessage} from '@/pages/dashboard/components/EmptyListMessage';

const SystemConfigEditorCore = () => {
    const {systemConfig} = useSystemConfig();

    return <div>
        {systemConfig.map(systemConfigValue => (
            <SystemConfigValueEditor key={systemConfigValue.Name} systemConfigValue={systemConfigValue}/>
        ))}
        {!systemConfig.length && (
            <EmptyListMessage>
                No system config values found.
            </EmptyListMessage>
        )}
    </div>;
};

export const SystemConfigEditor = () => (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <SystemConfigProvider>
                <SystemConfigEditorCore/>
            </SystemConfigProvider>
        </Suspense>
    </>
);
