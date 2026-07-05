import { Outlet } from 'react-router';

import { MainMenu } from '@/pages/dashboard/components/MainMenu/MainMenu';
import { WebSocketContextProvider } from '@/contexts/WebSocketProvider';
import styles from './DashboardLayout.module.css';

export const DashboardLayout = () => (
    <WebSocketContextProvider>
        <div className={styles.root}>
            <MainMenu/>
            <div className={styles.main}>
                <Outlet/>
            </div>
        </div>
    </WebSocketContextProvider>
);
