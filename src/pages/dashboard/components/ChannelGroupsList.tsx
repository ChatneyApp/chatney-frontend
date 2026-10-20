import { Suspense } from 'react';
import { Link } from 'react-router';
import { Tabs } from 'radix-ui';
import { Trans, useTranslation } from 'react-i18next';

import { useWorkspacesList, WorkspacesListProvider } from '@/contexts/WorkspacesListContext';
import {
    useWorkspaceChannelGroupsList,
    WorkspaceChannelGroupsListProvider
} from '@/contexts/WorkspaceChannelGroupsListContext';
import { WorkspaceChannelsListProvider } from '@/contexts/OldWorkspaceChannelsListContext';
import { ChannelGroupEditor } from './ChannelGroupEditor/ChannelGroupEditor';
import { TabsContent, TabsList, TabsTrigger } from '@/pages/dashboard/components/Tabs/Tabs';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';
import { ChannelGroupForm } from '@/pages/dashboard/components/ChannelGroupForm/ChannelGroupForm';

const ChannelGroupsListCore = () => {
    const { t } = useTranslation();
    const { channelGroups } = useWorkspaceChannelGroupsList();

    return <div>
        <ChannelGroupForm cta={t('dashboard.channelGroups.create')} title={t('dashboard.channelGroups.createTitle')} submitText={t('dashboard.channelGroups.createTitle')}/>
        {channelGroups.map(channelGroup => (
            <ChannelGroupEditor key={channelGroup.id} channelGroup={channelGroup}/>
        ))}
        {!channelGroups.length && (
            <EmptyListMessage>
                {t('dashboard.channelGroups.empty')}
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
                <WorkspaceChannelGroupsListProvider workspace={workspace}>
                    <WorkspaceChannelsListProvider workspace={workspace}>
                        <ChannelGroupsListCore key={workspace.id}/>
                    </WorkspaceChannelsListProvider>
                </WorkspaceChannelGroupsListProvider>
            </TabsContent>
        ))}
    </Tabs.Root>
}

export const ChannelGroupsList = () => {
    const { t } = useTranslation();

    return (
        <>
            <Suspense fallback={<div>{t('common.loading')}</div>}>
                <WorkspacesListProvider>
                    <WorkspaceChannelsList/>
                </WorkspacesListProvider>
            </Suspense>
        </>
    );
};
