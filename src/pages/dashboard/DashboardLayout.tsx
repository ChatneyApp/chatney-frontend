import {Outlet} from 'react-router';

import {MainMenu} from '@/pages/dashboard/components/MainMenu';
import styles from './DashboardLayout.module.css';

export const DashboardLayout = () => (
    <div className={styles.root}>
        <MainMenu/>
        <div className={styles.main}>
            <Outlet/>
        </div>
    </div>
);
