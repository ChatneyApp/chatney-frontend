import { useTranslation } from 'react-i18next';

import { SystemConfigEditor } from '@/pages/dashboard/components/SystemConfigEditor';

export const DashboardConfigPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('dashboard.pages.config')}</h2>
            <SystemConfigEditor/>
        </div>
    );
};
