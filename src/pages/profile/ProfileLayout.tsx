import { NavLink, Outlet } from 'react-router';
import { ArrowLeft } from 'lucide-react';

import styles from './ProfileLayout.module.css';

export function ProfileLayout() {
    return (
        <div className={styles.root}>
            <header className={styles.header}>
                <NavLink to="/client" className={styles.backLink}>
                    <ArrowLeft size={16} />
                    Back to chat
                </NavLink>
                <div className={styles.title}>Profile</div>
                <div />
            </header>
            <main className={styles.main}>
                <Outlet />
            </main>
        </div>
    );
}
