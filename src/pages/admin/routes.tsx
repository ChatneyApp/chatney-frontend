import { Navigate, Route } from 'react-router';

import { AdminLayout } from '@/pages/admin/AdminLayout';
import { RolesPage } from '@/pages/admin/roles/RolesPage';

export const adminRoutes = () => (
    <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="roles" replace />} />
        <Route path="roles" element={<RolesPage />} />
    </Route>
);
