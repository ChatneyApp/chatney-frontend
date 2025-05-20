import {Route} from 'react-router';

import {DashboardLayout} from '@/pages/dashboard/layout/DashboardLayout.tsx';
import {DashboardHomePage} from '@/pages/dashboard/DashboardHomePage.tsx';
import {DashboardPermissionsPage} from '@/pages/dashboard/DashboardPermissionsPage.tsx';
import {DashboardRolesPage} from '@/pages/dashboard/DashboardRolesPage.tsx';
import {DashboardChannelTypesPage} from '@/pages/dashboard/DashboardChannelTypesPage.tsx';
import {DashboardWorkspacesPage} from '@/pages/dashboard/DashboardWorkspacesPage.tsx';
import {DashboardChannelsPage} from '@/pages/dashboard/DashboardChannelsPage.tsx';
import {DashboardChannelGroupsPage} from '@/pages/dashboard/DashboardChannelGroupsPage.tsx';
import {DashboardUsersPage} from '@/pages/dashboard/DashboardUsersPage.tsx';

export const dashboardRoutes = () => (
    <Route path="dashboard" element={<DashboardLayout/>}>
        <Route index element={<DashboardHomePage/>}/>
        <Route path="permissions" element={<DashboardPermissionsPage/>}/>
        <Route path="roles" element={<DashboardRolesPage/>}/>
        <Route path="channelTypes" element={<DashboardChannelTypesPage/>}/>
        <Route path="workspaces" element={<DashboardWorkspacesPage/>}/>
        <Route path="channels" element={<DashboardChannelsPage/>}/>
        <Route path="channelGroups" element={<DashboardChannelGroupsPage/>}/>
        <Route path="users" element={<DashboardUsersPage/>}/>
    </Route>
);
