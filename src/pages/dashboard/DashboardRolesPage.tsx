import { useTranslation } from 'react-i18next';

import { RolesList } from '@/pages/dashboard/components/RolesList';

export const DashboardRolesPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('dashboard.pages.roles')}</h2>
            <RolesList/>
        </div>
    );
};
