import { Suspense } from 'react';
import { Link } from 'react-router';
import { Tabs } from 'radix-ui';
import { Trans, useTranslation } from 'react-i18next';

import { useWorkspacesList, WorkspacesListProvider } from '@/contexts/WorkspacesListContext';
import { useWorkspaceChannelsList, WorkspaceChannelsListProvider } from '@/contexts/OldWorkspaceChannelsListContext';
import { ChannelEditor } from '@/pages/dashboard/components/ChannelEditor/ChannelEditor';
import { ChannelTypesListProvider } from '@/contexts/ChannelTypesListContext';
import { CreateChannelForm } from '@/pages/dashboard/components/ChannelForm/CreateChannelForm';
import { TabsContent, TabsList, TabsTrigger } from '@/pages/dashboard/components/Tabs/Tabs';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';

const ChannelsListCore = () => {
    const { t } = useTranslation();
    const { channels } = useWorkspaceChannelsList();

    return <div>
        <CreateChannelForm cta={t('dashboard.channels.create')} title={t('dashboard.channels.createTitle')} submitText={t('dashboard.channels.createTitle')}/>
        {channels.map(channel => (
            <ChannelEditor key={channel.id} channel={channel}/>
        ))}
        {!channels.length && (
            <EmptyListMessage>
                {t('dashboard.channels.empty')}
            </EmptyListMessage>
        )}
    </div>;
};

const WorkspaceChannelsList = () => {
    const { t } = useTranslation();
    const { workspacesList } = useWorkspacesList();

    const defaultWorkspace = workspacesList[0];

    if (!defaultWorkspace) {
        return <div>
            <Trans
                i18nKey="dashboard.noWorkspaces"
                components={{ link: <Link to="/dashboard/workspaces" /> }}
            />
        </div>;
    }

    return <Tabs.Root
        defaultValue={defaultWorkspace.id.toString()}
    >
        <TabsList
            aria-label={t('dashboard.workspaceTabs')}
        >
            {workspacesList.map(workspace => (
                <TabsTrigger
                    key={workspace.id}
                    value={workspace.id.toString()}
                >
                    {workspace.name}
                </TabsTrigger>
            ))}
        </TabsList>
        {workspacesList.map(workspace => (
            <TabsContent
                key={workspace.id}
                value={workspace.id.toString()}
            >
                <WorkspaceChannelsListProvider workspace={workspace}>
                    <ChannelsListCore key={workspace.id}/>
                </WorkspaceChannelsListProvider>
            </TabsContent>
        ))}
    </Tabs.Root>
}

export const ChannelsList = () => {
    const { t } = useTranslation();

    return (
        <>
            <Suspense fallback={<div>{t('common.loading')}</div>}>
                <ChannelTypesListProvider>
                    <WorkspacesListProvider>
                        <WorkspaceChannelsList/>
                    </WorkspacesListProvider>
                </ChannelTypesListProvider>
            </Suspense>
        </>
    );
};
