import { BrowserRouter, Routes } from 'react-router';

import { GraphqlProvider } from '@/contexts/GraphqlProvider';
import { UserProvider } from '@/contexts/UserContext';

import { dashboardRoutes } from '@/pages/dashboard/routes';
import { adminRoutes } from '@/pages/admin/routes';
import { profileRoutes } from '@/pages/profile/routes';
import { clientRoutes } from '@/pages/client/routes';
import { LoginRegisterPage } from '@/pages/login/ClientHomePage';
import { ForgotPasswordPage, ResetPasswordPage } from '@/pages/login/PasswordResetPage';
import { composeProviders } from '@/infra/composeProviders';
import {
    forgotPasswordPageUrl,
    installSystemPageUrl,
    loginPageUrl,
    resetPasswordPageUrl,
} from '@/infra/consts';
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

    if (window.location.pathname === forgotPasswordPageUrl) {
        return <ForgotPasswordPage />;
    }

    if (window.location.pathname === resetPasswordPageUrl) {
        return <ResetPasswordPage />;
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
                {adminRoutes()}
                {profileRoutes()}
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
