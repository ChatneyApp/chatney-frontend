import {Route} from 'react-router';

import {ClientLayout} from '@/pages/client/ClientLayout';
import {ClientHomePage} from '@/pages/client/ClientHomePage';

export const clientRoutes = () => (
    <>
        <Route path="client" element={<ClientLayout/>}>
            <Route index element={<ClientHomePage/>}/>
        </Route>
    </>
);
