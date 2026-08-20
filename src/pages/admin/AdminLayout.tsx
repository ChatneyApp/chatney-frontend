import { NavLink, Outlet } from 'react-router';
import { MessageSquare, Shield, Users } from 'lucide-react';
import clsx from 'clsx';

import { WebSocketContextProvider } from '@/contexts/WebSocketProvider';

import styles from './AdminLayout.module.css';

const isActiveLink = ({ isActive }: { isActive: boolean }) =>
    clsx(styles.navLink, isActive && styles.navLinkActive);

export function AdminLayout() {
    return (
        <WebSocketContextProvider>
            <div className={styles.root}>
                <aside className={styles.sidebar}>
                    <div className={styles.brand}>Admin</div>
                    <nav className={styles.nav}>
                        <NavLink to="/admin/roles" className={isActiveLink}>
                            <Shield size={16} />
                            Roles
                        </NavLink>
                        <NavLink to="/admin/users" className={isActiveLink}>
                            <Users size={16} />
                            Users
                        </NavLink>
                    </nav>
                    <div className={styles.sidebarFooter}>
                        <NavLink to="/client" className={styles.navLink}>
                            <MessageSquare size={16} />
                            Back to chat
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
