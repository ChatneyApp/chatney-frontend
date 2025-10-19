import { BrowserRouter, Routes } from 'react-router';

import { GraphqlProvider } from '@/contexts/GraphqlProvider';
import { UserProvider } from '@/contexts/UserContext';

import { dashboardRoutes } from '@/pages/dashboard/routes';
import { clientRoutes } from '@/pages/client/routes';
import { LoginRegisterPage } from '@/pages/login/ClientHomePage';
import { composeProviders } from '@/infra/composeProviders';
import { installSystemPageUrl, loginPageUrl } from '@/infra/consts';
import { InstallSystemPage } from './pages/installation/InstallSystemPage';

const providers = [
    BrowserRouter,
    UserProvider,
];

const ComposedProviders = composeProviders(providers);

const LoginPageRouterSelector = () => {
    const isLoginPage = window.location.pathname == loginPageUrl;

    if (isLoginPage) {
        return (
            <LoginRegisterPage/>
        );
    }

    if (window.location.pathname === installSystemPageUrl) {
        return (
            <InstallSystemPage/>
        );
    }

    return (
        <ComposedProviders>
            <Routes>
                {dashboardRoutes()}
                {clientRoutes()}
            </Routes>
        </ComposedProviders>
    );
}

export const App = () => (
    <GraphqlProvider>
        <LoginPageRouterSelector/>
    </GraphqlProvider>
);
