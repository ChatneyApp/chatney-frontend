import {Link} from 'react-router';
import {Tabs} from 'radix-ui';

import {UserWorkspacesListProvider, useUserWorkspacesList} from '@/contexts/UserWorkspacesListContext';
import {TabsContent, TabsList, TabsTrigger} from '@/pages/dashboard/components/Tabs/Tabs';
import {WorkspaceChannelsListProvider} from '@/contexts/WorkspaceChannelsListContext';
import {UserDataProvider} from '@/contexts/UserDataContext';

const WorkspaceChannelsList = () => {
    const {workspaces} = useUserWorkspacesList();
    const defaultWorkspace = workspaces?.[0];

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
                    {workspace.Id} - {workspace.Name}
                </WorkspaceChannelsListProvider>
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
                user
                <WorkspaceChannelsList/>
            </UserWorkspacesListProvider>
        </UserDataProvider>
    </div>
);
