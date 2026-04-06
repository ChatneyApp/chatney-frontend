import { Outlet } from 'react-router';

import { WorkspacesListProvider } from '@/contexts/WorkspacesListContext';
import { WorkspaceChannelsListProvider } from '@/contexts/WorkspaceChannelsListContext';
import { composeProviders } from '@/infra/composeProviders';
import { WebSocketContextProvider } from '@/contexts/WebSocketProvider';
import { ChannelTypesListProvider } from '@/contexts/ChannelTypesListContext';

const providers = [
    WebSocketContextProvider,
    ChannelTypesListProvider,
    WorkspacesListProvider,
    WorkspaceChannelsListProvider,
];
const ComposedProviders = composeProviders(providers);

export const ClientLayout = () => (
    <div>
        <ComposedProviders>
            <Outlet />
        </ComposedProviders>
    </div>
);
