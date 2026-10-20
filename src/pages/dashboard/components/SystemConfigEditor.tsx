import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { SystemConfigProvider, useSystemConfig } from '@/contexts/SystemConfigProvider';
import {
    SystemConfigValueEditor
} from '@/pages/dashboard/components/SystemConfigValueEditor/SystemConfigValueEditor';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';

const SystemConfigEditorCore = () => {
    const { t } = useTranslation();
    const { systemConfig } = useSystemConfig();

    return <div>
        {systemConfig.map(systemConfigValue => (
            <SystemConfigValueEditor key={systemConfigValue.name} systemConfigValue={systemConfigValue}/>
        ))}
        {!systemConfig.length && (
            <EmptyListMessage>
                {t('dashboard.config.empty')}
            </EmptyListMessage>
        )}
    </div>;
};

export const SystemConfigEditor = () => {
    const { t } = useTranslation();

    return (
        <>
            <Suspense fallback={<div>{t('common.loading')}</div>}>
                <SystemConfigProvider>
                    <SystemConfigEditorCore/>
                </SystemConfigProvider>
            </Suspense>
        </>
    );
};
