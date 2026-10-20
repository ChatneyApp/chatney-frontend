import { NavLink, Outlet } from 'react-router';
import { MessageSquare, Shield, Users } from 'lucide-react';
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
