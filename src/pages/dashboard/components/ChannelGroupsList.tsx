import {Suspense} from 'react';
import {Link} from 'react-router';
import {Tabs} from 'radix-ui';

import {useWorkspacesList, WorkspacesListProvider} from '@/contexts/WorkspacesListContext';
import {
    useWorkspaceChannelGroupsList,
    WorkspaceChannelGroupsListProvider
} from '@/contexts/WorkspaceChannelGroupsListContext';
import {WorkspaceChannelsListProvider} from '@/contexts/WorkspaceChannelsListContext';
import {ChannelGroupEditor} from './ChannelGroupEditor/ChannelGroupEditor';
import {TabsContent, TabsList, TabsTrigger} from '@/pages/dashboard/components/Tabs/Tabs';
import {EmptyListMessage} from '@/pages/dashboard/components/EmptyListMessage';
import {ChannelGroupForm} from '@/pages/dashboard/components/ChannelGroupForm/ChannelGroupForm';

const ChannelGroupsListCore = () => {
    const {channelGroups} = useWorkspaceChannelGroupsList();

    return <div>
        <ChannelGroupForm cta="Create channel group" title="Create Channel Group" submitText="Create Channel Group"/>
        {channelGroups.map(channelGroup => (
            <ChannelGroupEditor key={channelGroup.Id} channelGroup={channelGroup}/>
        ))}
        {!channelGroups.length && (
            <EmptyListMessage>
                No channel groups found. Create one using the form above.
            </EmptyListMessage>
        )}
    </div>;
};

const WorkspaceChannelsList = () => {
    const {workspaces} = useWorkspacesList();

    const defaultWorkspace = workspaces[0];

    if (!defaultWorkspace) {
        return <div>
            No workspaces found. Create one at <Link to="/dashboard/workspaces">Workspaces</Link>.
        </div>;
    }

    return <Tabs.Root
        defaultValue={defaultWorkspace.Id}
    >
        <TabsList
            aria-label="Manage your account"
        >
            {workspaces.map(workspace => (
                <TabsTrigger
                    key={workspace.Id}
                    value={workspace.Id}
                >
                    {workspace.Name}
                </TabsTrigger>
            ))}
        </TabsList>
        {workspaces.map(workspace => (
            <TabsContent
                key={workspace.Id}
                value={workspace.Id}
            >
                <WorkspaceChannelGroupsListProvider workspace={workspace}>
                    <WorkspaceChannelsListProvider workspace={workspace}>
                        <ChannelGroupsListCore key={workspace.Id}/>
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
