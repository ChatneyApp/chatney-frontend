import { BrowserRouter, Route, Routes } from 'react-router';

import { GraphqlProvider } from '@/contexts/GraphqlProvider';

import { dashboardRoutes } from '@/pages/dashboard/routes';
import { clientRoutes } from '@/pages/client/routes';
import { UserProvider } from './contexts/UserContext';
import { composeProviders } from './infra/composeProviders';
import { WorkspacesListProvider } from './contexts/WorkspacesListContext';
import { LoginRegisterPage } from './pages/login/ClientHomePage';
import { ChatPage } from './pages/client/Chat/ChatPage';
import { loginPageUrl } from './infra/consts';

const providers = [
    BrowserRouter,
    UserProvider,
    WorkspacesListProvider
];

const ComposedProviders = composeProviders(providers);

export const App = () => {
    const loginPage = window.location.pathname == loginPageUrl;

    return <GraphqlProvider>
        {loginPage && <LoginRegisterPage />}
        {!loginPage && <ComposedProviders>
            <Routes>
                <Route index element={<ChatPage />} />
                {dashboardRoutes()}
                {clientRoutes()}
            </Routes>
        </ComposedProviders>}
    </GraphqlProvider>
}
