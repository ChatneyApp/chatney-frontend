import { useTranslation } from 'react-i18next';

export const DashboardUsersPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            {t('dashboard.pages.users')}
        </div>
    );
};
