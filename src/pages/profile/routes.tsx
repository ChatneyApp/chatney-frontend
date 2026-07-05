import { Route } from 'react-router';

import { ProfileLayout } from '@/pages/profile/ProfileLayout';
import { ProfilePage } from '@/pages/profile/ProfilePage';

export const profileRoutes = () => (
    <Route path="profile" element={<ProfileLayout />}>
        <Route index element={<ProfilePage />} />
    </Route>
);
