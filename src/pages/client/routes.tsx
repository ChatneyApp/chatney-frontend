import {Route} from 'react-router';

import {ClientLayout} from '@/pages/client/ClientLayout';
import {ClientHomePage} from '@/pages/client/ClientHomePage';
import {ClientWorkspacesPage} from '@/pages/client/ClientWorkspacesPage';

export const clientRoutes = () => (
    <>
        <Route path="client" element={<ClientLayout/>}>
            <Route index element={<ClientHomePage/>}/>
            <Route path="workspaces" element={<ClientWorkspacesPage/>}/>
        </Route>
    </>
);
