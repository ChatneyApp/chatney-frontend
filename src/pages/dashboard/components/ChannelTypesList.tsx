import { Suspense } from 'react';

import { ChannelTypeEditor } from '@/pages/dashboard/components/ChannelTypeEditor/ChannelTypeEditor';
import { CreateChannelTypeForm } from '@/pages/dashboard/components/ChannelTypeForm/CreateChannelTypeForm';
import { ChannelTypesListProvider, useChannelTypesList } from '@/contexts/ChannelTypesListContext';
import { RolesListProvider } from '@/contexts/RolesListContext';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';

const ChannelTypesListCore = () => {
    const { channelTypes } = useChannelTypesList();

    return <div>
        {channelTypes.map(channelType => (
            <ChannelTypeEditor key={channelType.Id} channelType={channelType}/>
        ))}
        {!channelTypes.length && (
            <EmptyListMessage>
                No channels types found. Create one using the form above.
            </EmptyListMessage>
        )}
    </div>;
};

export const ChannelTypesList = () => (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <RolesListProvider>
                <ChannelTypesListProvider>
                    <CreateChannelTypeForm cta="Create channel type" title="Create Channel Type" submitText="Create Channel Type"/>
                    <ChannelTypesListCore/>
                </ChannelTypesListProvider>
            </RolesListProvider>
        </Suspense>
    </>
);
