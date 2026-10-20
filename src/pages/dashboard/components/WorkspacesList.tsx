import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';

import { WorkspaceEditor } from '@/pages/dashboard/components/WorkspaceEditor/WorkspaceEditor';
import { CreateWorkspaceForm } from '@/pages/dashboard/components/WorkspaceForm/CreateWorkspaceForm';
import { WorkspacesListProvider, useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';

const WorkspacesListCore = () => {
    const { t } = useTranslation();
    const { workspacesList } = useWorkspacesList();

    return <div>
        {workspacesList.map(workspace => (
            <WorkspaceEditor key={workspace.id} workspace={workspace}/>
        ))}
        {!workspacesList.length && (
            <EmptyListMessage>
                {t('dashboard.workspaces.empty')}
            </EmptyListMessage>
        )}
    </div>;
};

export const WorkspacesList = () => {
    const { t } = useTranslation();

    return (
        <>
            <Suspense fallback={<div>{t('common.loading')}</div>}>
                <WorkspacesListProvider>
                    <CreateWorkspaceForm cta={t('dashboard.workspaces.create')} title={t('dashboard.workspaces.createTitle')} submitText={t('dashboard.workspaces.createTitle')}/>
                    <WorkspacesListCore/>
                </WorkspacesListProvider>
            </Suspense>
        </>
    );
};
