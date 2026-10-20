import { useTranslation } from 'react-i18next';

import { ChannelGroupsList } from '@/pages/dashboard/components/ChannelGroupsList';

export const DashboardChannelGroupsPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('dashboard.pages.channelGroups')}</h2>
            <ChannelGroupsList/>
        </div>
    );
};
