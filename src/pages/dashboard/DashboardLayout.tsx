import {Outlet} from 'react-router';

import {MainMenu} from '@/pages/dashboard/components/MainMenu';

export const DashboardLayout = () => (
    <div>
        <h1>Dashboard</h1>
        <MainMenu/>
        <Outlet/>
    </div>
);
