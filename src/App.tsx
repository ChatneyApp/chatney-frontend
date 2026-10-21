import { LoaderCircle, MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes } from 'react-router';
import { useApolloClient } from '@apollo/client/react';

import { GraphqlProvider } from '@/contexts/GraphqlProvider';
import { UserProvider } from '@/contexts/UserContext';
import { isSystemInstalled } from '@/graphql/systemConfig';

import { dashboardRoutes } from '@/pages/dashboard/routes';
import { adminRoutes } from '@/pages/admin/routes';
import { profileRoutes } from '@/pages/profile/routes';
import { clientRoutes } from '@/pages/client/routes';
import { LoginRegisterPage } from '@/pages/login/ClientHomePage';
import { ForgotPasswordPage, ResetPasswordPage } from '@/pages/login/PasswordResetPage';
import { composeProviders } from '@/infra/composeProviders';
import {
    clientStartPageUrl,
    forgotPasswordPageUrl,
    installSystemPageUrl,
    loginPageUrl,
    resetPasswordPageUrl,
} from '@/infra/consts';
import { InstallSystemPage } from './pages/installation/InstallSystemPage';
import styles from './App.module.css';

const providers = [
    BrowserRouter,
    UserProvider,
];

const ComposedProviders = composeProviders(providers);

type InstallationStatus = 'checking' | 'installed' | 'not-installed';

const AppLoadingScreen = () => (
    <main className={styles.loadingPage}>
        <span className={styles.loadingLogo}><MessageCircle size={24} /></span>
        <LoaderCircle className={styles.spinner} size={20} />
        <span>Starting Chatney...</span>
    </main>
);

const LoginPageRouterSelector = () => {
    const apollo = useApolloClient();
    const [installationStatus, setInstallationStatus] = useState<InstallationStatus>('checking');
    const isLoginPage = window.location.pathname === loginPageUrl;

    useEffect(() => {
        let active = true;

        isSystemInstalled(apollo)
            .then(installed => {
                if (!active) {
                    return;
                }

                setInstallationStatus(installed ? 'installed' : 'not-installed');
            })
            .catch(() => {
                if (active) {
                    setInstallationStatus('not-installed');
                }
            });

        return () => {
            active = false;
        };
    }, [apollo]);

    if (installationStatus === 'checking') {
        return <AppLoadingScreen />;
    }

    if (installationStatus === 'not-installed'
        && window.location.pathname !== installSystemPageUrl) {
        window.location.replace(installSystemPageUrl);
        return <AppLoadingScreen />;
    }

    if (installationStatus === 'installed'
        && window.location.pathname === installSystemPageUrl) {
        window.location.replace(clientStartPageUrl);
        return <AppLoadingScreen />;
    }

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
