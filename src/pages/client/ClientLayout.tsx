import { Outlet } from 'react-router';

import { WorkspacesListProvider } from '@/contexts/WorkspacesListContext';
import { WorkspaceChannelsListProvider } from '@/contexts/WorkspaceChannelsListContext';
import { WorkspaceChannelGroupsListProvider } from '@/contexts/WorkspaceChannelGroupsListContext';
import { composeProviders } from '@/infra/composeProviders';
import { WebSocketContextProvider } from '@/contexts/WebSocketProvider';
import { ChannelTypesListProvider } from '@/contexts/ChannelTypesListContext';
import { DirectMessagesListProvider } from '@/contexts/DirectMessagesListContext';
import { RolesListProvider } from '@/contexts/RolesListContext.tsx';

const providers = [
    WebSocketContextProvider,
    RolesListProvider,
    ChannelTypesListProvider,
    WorkspacesListProvider,
    WorkspaceChannelsListProvider,
    WorkspaceChannelGroupsListProvider,
    DirectMessagesListProvider,
];
const ComposedProviders = composeProviders(providers);

export const ClientLayout = () => (
    <div>
        <ComposedProviders>
            <Outlet />
        </ComposedProviders>
    </div>
);
