import {Suspense} from 'react';
import {Link} from 'react-router';
import {Tabs} from 'radix-ui';

import {useWorkspacesList, WorkspacesListProvider} from '@/contexts/WorkspacesListContext';
import {useWorkspaceChannelsList, WorkspaceChannelsListProvider} from '@/contexts/WorkspaceChannelsListContext';
import {ChannelEditor} from '@/pages/dashboard/components/ChannelEditor/ChannelEditor';
import {ChannelTypesListProvider} from '@/contexts/ChannelTypesListContext';
import {CreateChannelForm} from '@/pages/dashboard/components/ChannelForm/CreateChannelForm';
import {TabsContent, TabsList, TabsTrigger} from '@/pages/dashboard/components/Tabs/Tabs';
import {EmptyListMessage} from '@/pages/dashboard/components/EmptyListMessage';

const ChannelsListCore = () => {
    const {channels} = useWorkspaceChannelsList();

    return <div>
        <CreateChannelForm cta="Create channel" title="Create Channel" submitText="Create Channel"/>
        {channels.map(channel => (
            <ChannelEditor key={channel.Id} channel={channel}/>
        ))}
        {!channels.length && (
            <EmptyListMessage>
                No channels found. Create one using the form above.
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
                <WorkspaceChannelsListProvider workspace={workspace}>
                    <ChannelsListCore key={workspace.Id}/>
                </WorkspaceChannelsListProvider>
            </TabsContent>
        ))}
    </Tabs.Root>
}

export const ChannelsList = () => (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <ChannelTypesListProvider>
                <WorkspacesListProvider>
                    <WorkspaceChannelsList/>
                </WorkspacesListProvider>
            </ChannelTypesListProvider>
        </Suspense>
    </>
);
