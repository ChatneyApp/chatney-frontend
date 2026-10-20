import { useTranslation } from 'react-i18next';

import { ChannelTypesList } from '@/pages/dashboard/components/ChannelTypesList';

export const DashboardChannelTypesPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('dashboard.pages.channelTypes')}</h2>
            <ChannelTypesList/>
        </div>
    );
};
