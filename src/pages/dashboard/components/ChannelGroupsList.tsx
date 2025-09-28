import { Suspense } from 'react';
import { Link } from 'react-router';
import { Tabs } from 'radix-ui';

import { useWorkspacesList, WorkspacesListProvider } from '@/contexts/WorkspacesListContext';
import {
    useWorkspaceChannelGroupsList,
    WorkspaceChannelGroupsListProvider
} from '@/contexts/WorkspaceChannelGroupsListContext';
import { WorkspaceChannelsListProvider } from '@/contexts/WorkspaceChannelsListContext';
import { ChannelGroupEditor } from './ChannelGroupEditor/ChannelGroupEditor';
import { TabsContent, TabsList, TabsTrigger } from '@/pages/dashboard/components/Tabs/Tabs';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';
import { ChannelGroupForm } from '@/pages/dashboard/components/ChannelGroupForm/ChannelGroupForm';

const ChannelGroupsListCore = () => {
    const { channelGroups } = useWorkspaceChannelGroupsList();

    return <div>
        <ChannelGroupForm cta="Create channel group" title="Create Channel Group" submitText="Create Channel Group"/>
        {channelGroups.map(channelGroup => (
            <ChannelGroupEditor key={channelGroup.id} channelGroup={channelGroup}/>
        ))}
        {!channelGroups.length && (
            <EmptyListMessage>
                No channel groups found. Create one using the form above.
            </EmptyListMessage>
        )}
    </div>;
};

const WorkspaceChannelsList = () => {
    const { workspacesList } = useWorkspacesList();

    const defaultWorkspace = workspacesList[0];

    if (!defaultWorkspace) {
        return <div>
            No workspaces found. Create one at <Link to="/dashboard/workspaces">Workspaces</Link>.
        </div>;
    }

    return <Tabs.Root
        defaultValue={defaultWorkspace.id}
    >
        <TabsList
            aria-label="Manage your account"
        >
            {workspacesList.map(workspace => (
                <TabsTrigger
                    key={workspace.id}
                    value={workspace.id}
                >
                    {workspace.name}
                </TabsTrigger>
            ))}
        </TabsList>
        {workspacesList.map(workspace => (
            <TabsContent
                key={workspace.id}
                value={workspace.id}
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

export const ChannelGroupsList = () => (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <WorkspacesListProvider>
                <WorkspaceChannelsList/>
            </WorkspacesListProvider>
        </Suspense>
    </>
);
