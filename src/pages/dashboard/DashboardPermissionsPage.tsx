import { useTranslation } from 'react-i18next';

import { PermissionsList } from './components/PermissionsList/PermissionsList';

export const DashboardPermissionsPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('dashboard.pages.permissions')}</h2>
            <PermissionsList/>
        </div>
    );
};
