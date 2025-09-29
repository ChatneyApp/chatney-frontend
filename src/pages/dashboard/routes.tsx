import { Route } from 'react-router';

import { DashboardLayout } from '@/pages/dashboard/layout/DashboardLayout';
import { DashboardHomePage } from '@/pages/dashboard/DashboardHomePage';
import { DashboardPermissionsPage } from '@/pages/dashboard/DashboardPermissionsPage';
import { DashboardRolesPage } from '@/pages/dashboard/DashboardRolesPage';
import { DashboardChannelTypesPage } from '@/pages/dashboard/DashboardChannelTypesPage';
import { DashboardWorkspacesPage } from '@/pages/dashboard/DashboardWorkspacesPage';
import { DashboardChannelsPage } from '@/pages/dashboard/DashboardChannelsPage';
import { DashboardChannelGroupsPage } from '@/pages/dashboard/DashboardChannelGroupsPage';
import { DashboardUsersPage } from '@/pages/dashboard/DashboardUsersPage';
import { DashboardConfigPage } from '@/pages/dashboard/DashboardConfigPage';

export const dashboardRoutes = () => (
    <Route path="dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHomePage />} />
        <Route path="permissions" element={<DashboardPermissionsPage />} />
        <Route path="roles" element={<DashboardRolesPage />} />
        <Route path="channelTypes" element={<DashboardChannelTypesPage />} />
        <Route path="workspaces" element={<DashboardWorkspacesPage/>}/>
        <Route path="channels" element={<DashboardChannelsPage />} />
        <Route path="channelGroups" element={<DashboardChannelGroupsPage />} />
        <Route path="users" element={<DashboardUsersPage />} />
        <Route path="config" element={<DashboardConfigPage />} />
    </Route>
);
