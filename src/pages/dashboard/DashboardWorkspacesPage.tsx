import { useTranslation } from 'react-i18next';

import { WorkspacesList } from '@/pages/dashboard/components/WorkspacesList';

export const DashboardWorkspacesPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h2>{t('dashboard.pages.workspaces')}</h2>
            <WorkspacesList/>
        </div>
    );
};
