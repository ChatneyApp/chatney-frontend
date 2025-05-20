import {BrowserRouter, Route, Routes} from 'react-router';

import {GraphqlProvider} from '@/contexts/GraphqlProvider';

import {HomePage} from '@/pages/home/HomePage';
import {dashboardRoutes} from '@/pages/dashboard/routes';
import {clientRoutes} from '@/pages/client/routes';

export const App = () => (
    <GraphqlProvider>
        <BrowserRouter>
            <Routes>
                <Route index element={<HomePage/>}/>
                {dashboardRoutes()}
                {clientRoutes()}
            </Routes>
        </BrowserRouter>
    </GraphqlProvider>
);
