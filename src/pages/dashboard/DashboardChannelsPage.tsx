import { useTranslation } from 'react-i18next';

import { ChannelsList } from '@/pages/dashboard/components/ChannelsList';

export const DashboardChannelsPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('dashboard.pages.channels')}</h2>
            <ChannelsList/>
        </div>
    );
};
