import {Outlet} from 'react-router';

import {MainMenu} from '@/pages/dashboard/components/MainMenu';

export const DashboardLayout = () => (
    <div>
        <MainMenu/>
        <Outlet/>
    </div>
);
