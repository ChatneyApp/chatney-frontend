import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { ChannelTypeEditor } from '@/pages/dashboard/components/ChannelTypeEditor/ChannelTypeEditor';
import { CreateChannelTypeForm } from '@/pages/dashboard/components/ChannelTypeForm/CreateChannelTypeForm';
import { ChannelTypesListProvider, useChannelTypesList } from '@/contexts/ChannelTypesListContext';
import { RolesListProvider } from '@/contexts/RolesListContext';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';

const ChannelTypesListCore = () => {
    const { t } = useTranslation();
    const { channelTypes } = useChannelTypesList();

    return <div>
        {channelTypes.map(channelType => (
            <ChannelTypeEditor key={channelType.id} channelType={channelType}/>
        ))}
        {!channelTypes.length && (
            <EmptyListMessage>
                {t('dashboard.channelTypes.empty')}
            </EmptyListMessage>
        )}
    </div>;
};

export const ChannelTypesList = () => {
    const { t } = useTranslation();

    return (
        <>
            <Suspense fallback={<div>{t('common.loading')}</div>}>
                <RolesListProvider>
                    <ChannelTypesListProvider>
                        <CreateChannelTypeForm cta={t('dashboard.channelTypes.create')} title={t('dashboard.channelTypes.createTitle')} submitText={t('dashboard.channelTypes.createTitle')}/>
                        <ChannelTypesListCore/>
                    </ChannelTypesListProvider>
                </RolesListProvider>
            </Suspense>
        </>
    );
};
