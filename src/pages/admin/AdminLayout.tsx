import { NavLink, Outlet } from 'react-router';
import { LayoutGrid, MessageSquare, Settings, Shield, Tags, Users } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { WebSocketContextProvider } from '@/contexts/WebSocketProvider';

import styles from './AdminLayout.module.css';

const isActiveLink = ({ isActive }: { isActive: boolean }) =>
    clsx(styles.navLink, isActive && styles.navLinkActive);

export function AdminLayout() {
    const { t } = useTranslation();

    return (
        <WebSocketContextProvider>
            <div className={styles.root}>
                <aside className={styles.sidebar}>
                    <div className={styles.brand}>{t('admin.nav.brand')}</div>
                    <nav className={styles.nav}>
                        <NavLink to="/admin/roles" className={isActiveLink}>
                            <Shield size={16} />
                            {t('admin.nav.roles')}
                        </NavLink>
                        <NavLink to="/admin/users" className={isActiveLink}>
                            <Users size={16} />
                            {t('admin.nav.users')}
                        </NavLink>
                        <NavLink to="/admin/workspaces" className={isActiveLink}>
                            <LayoutGrid size={16} />
                            {t('admin.nav.workspaces')}
                        </NavLink>
                        <NavLink to="/admin/channel-types" className={isActiveLink}>
                            <Tags size={16} />
                            {t('admin.nav.channelTypes')}
                        </NavLink>
                        <NavLink to="/admin/config" className={isActiveLink}>
                            <Settings size={16} />
                            {t('admin.nav.config')}
                        </NavLink>
                    </nav>
                    <div className={styles.sidebarFooter}>
                        <NavLink to="/client" className={styles.navLink}>
                            <MessageSquare size={16} />
                            {t('admin.nav.backToChat')}
                        </NavLink>
                    </div>
                </aside>
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </WebSocketContextProvider>
    );
}
