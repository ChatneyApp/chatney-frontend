import {Suspense} from 'react';
import {Link} from 'react-router';
import {Tabs} from 'radix-ui';

import {useWorkspacesList, WorkspacesListProvider} from '@/contexts/WorkspacesListContext';
import {useWorkspaceChannelsList, WorkspaceChannelsListProvider} from '@/contexts/WorkspaceChannelsListContext';
import {ChannelEditor} from '@/pages/dashboard/components/ChannelEditor/ChannelEditor';
import {ChannelTypesListProvider} from '@/contexts/ChannelTypesListContext';
import {CreateChannelForm} from '@/pages/dashboard/components/ChannelForm/CreateChannelForm';

const ChannelsListCore = () => {
    const {channels} = useWorkspaceChannelsList();

    return <div>
        <CreateChannelForm cta="Create channel" title="Create Channel" submitText="Create Channel"/>
        {channels.map(channel => (
            <ChannelEditor key={channel.Id} channel={channel}/>
        ))}
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
        className="flex w-[300px] flex-col shadow-[0_2px_10px] shadow-blackA2"
        defaultValue={defaultWorkspace.Id}
    >
        <Tabs.List
            className="flex shrink-0 border-b border-mauve6"
            aria-label="Manage your account"
        >
            {workspaces.map(workspace => (
                <Tabs.Trigger
                    className="flex h-[45px] flex-1 cursor-default select-none items-center justify-center bg-white px-5 text-[15px] leading-none text-mauve11 outline-none first:rounded-tl-md last:rounded-tr-md hover:text-violet11 data-[state=active]:text-violet11 data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:shadow-current data-[state=active]:focus:relative data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow-black"
                    key={workspace.Id}
                    value={workspace.Id}
                >
                    {workspace.Name}
                </Tabs.Trigger>
            ))}
        </Tabs.List>
        {workspaces.map(workspace => (
            <Tabs.Content
                className="grow rounded-b-md bg-white p-5 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black"
                key={workspace.Id}
                value={workspace.Id}
            >
                <WorkspaceChannelsListProvider workspace={workspace}>
                    {/*<CreateChannelTypeForm cta="Edit" title="Edit Channel Type" submitText="Save Changes" channelType={channelType}/>*/}
                    <ChannelsListCore key={workspace.Id}/>
                </WorkspaceChannelsListProvider>
            </Tabs.Content>
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
