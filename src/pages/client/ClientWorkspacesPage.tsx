import { Link } from 'react-router';
import { Tabs } from 'radix-ui';

import { UserWorkspacesListProvider, useUserWorkspacesList } from '@/contexts/UserWorkspacesListContext';
import { TabsContent, TabsList, TabsTrigger } from '@/pages/dashboard/components/Tabs/Tabs';
import { UserDataProvider } from '@/contexts/UserDataContext';
import {
    UserWorkspaceChannelsListContextProvider,
    useUserWorkspaceChannelsList
} from '@/contexts/UserWorkspaceChannelsListContext';
import { Channel } from '@/types/channels';

const UserChannel = ({ channel }: {channel: Channel}) => (
    <div className="p-2 flex flex-row gap-2 justify-center items-center">
        <div className="text-lg font-bold text-amber-700">{channel.name}</div>
        <div className="mt-2">
            <Link to={`/client/channel/${channel.id}`} className="text-blue-500 hover:underline">
                Open
            </Link>
        </div>
    </div>
);

const ChannelsListCore = () => {
    const { channels } = useUserWorkspaceChannelsList();

    return <div className="flex flex-col gap-2">
        {channels.map(channel => (
            <UserChannel key={channel.id} channel={channel}/>
        ))}
    </div>;
};

const WorkspaceChannelsList = () => {
    const { workspaces } = useUserWorkspacesList();
    const defaultWorkspace = workspaces?.[0];

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
            {workspaces.map(workspace => (
                <TabsTrigger
                    key={workspace.id}
                    value={workspace.id}
                >
                    <span className="font-normal text-gray-600">[{workspace.id}]</span>
                    &nbsp;
                    <span className="font-bold">{workspace.name}</span>
                </TabsTrigger>
            ))}
        </TabsList>
        {workspaces.map(workspace => (
            <TabsContent
                key={workspace.id}
                value={workspace.id}
            >
                <UserWorkspaceChannelsListContextProvider workspace={workspace}>
                    <ChannelsListCore />
                </UserWorkspaceChannelsListContextProvider>
            </TabsContent>
        ))}
    </Tabs.Root>
}

export const ClientWorkspacesPage = () => (
    <div>
        <h1>
            Workspaces Page
        </h1>
        <UserDataProvider>
            <UserWorkspacesListProvider>
                <WorkspaceChannelsList/>
            </UserWorkspacesListProvider>
        </UserDataProvider>
    </div>
);
