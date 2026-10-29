import { Navigate, Route } from 'react-router';

import { AdminLayout } from '@/pages/admin/AdminLayout';
import { RolesPage } from '@/pages/admin/roles/RolesPage';
import { UsersPage } from '@/pages/admin/users/UsersPage';
import { WorkspacesPage } from '@/pages/admin/workspaces/WorkspacesPage';
import { ChannelTypesPage } from '@/pages/admin/channelTypes/ChannelTypesPage';
import { WorkspaceChannelsPage } from '@/pages/admin/workspaceChannels/WorkspaceChannelsPage';
import { WorkspaceChannelGroupsPage } from '@/pages/admin/workspaceChannelGroups/WorkspaceChannelGroupsPage';
import { ConfigPage } from '@/pages/admin/config/ConfigPage';

export const adminRoutes = () => (
    <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="roles" replace />} />
        <Route path="roles" element={<RolesPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="workspaces" element={<WorkspacesPage />} />
        <Route path="workspaces/:workspaceId/channels" element={<WorkspaceChannelsPage />} />
        <Route path="workspaces/:workspaceId/channel-groups" element={<WorkspaceChannelGroupsPage />} />
        <Route path="channel-types" element={<ChannelTypesPage />} />
        <Route path="config" element={<ConfigPage />} />
    </Route>
);
