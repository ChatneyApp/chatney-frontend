import { useTranslation } from 'react-i18next';

export const DashboardHomePage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('dashboard.pages.home')}</h2>
        </div>
    );
};
