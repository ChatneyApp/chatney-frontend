import {BrowserRouter, Route, Routes} from 'react-router';

import {GraphqlProvider} from '@/contexts/GraphqlProvider';

// client
import {ClientLayout} from '@/pages/client/ClientLayout';
import {ClientHomePage} from '@/pages/client/ClientHomePage';
// dashboard
import {HomePage} from '@/pages/HomePage';
import {DashboardLayout} from '@/pages/dashboard/DashboardLayout';
import {DashboardHomePage} from '@/pages/dashboard/DashboardHomePage';
import {DashboardPermissionsPage} from '@/pages/dashboard/DashboardPermissionsPage';
import {DashboardChannelTypesPage} from '@/pages/dashboard/DashboardChannelTypesPage';
import {DashboardChannelsPage} from '@/pages/dashboard/DashboardChannelsPage';
import {DashboardUsersPage} from '@/pages/dashboard/DashboardUsersPage';
import {DashboardRolesPage} from '@/pages/dashboard/DashboardRolesPage';

export const App = () => (
    <GraphqlProvider>
        <BrowserRouter>
            <Routes>
                <Route index element={<HomePage/>}/>
                <Route path="dashboard" element={<DashboardLayout/>}>
                    <Route index element={<DashboardHomePage/>}/>
                    <Route path="permissions" element={<DashboardPermissionsPage/>}/>
                    <Route path="roles" element={<DashboardRolesPage/>}/>
                    <Route path="channelTypes" element={<DashboardChannelTypesPage/>}/>
                    <Route path="channels" element={<DashboardChannelsPage/>}/>
                    <Route path="users" element={<DashboardUsersPage/>}/>
                </Route>
                <Route path="client" element={<ClientLayout/>}>
                    <Route index element={<ClientHomePage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    </GraphqlProvider>
);
