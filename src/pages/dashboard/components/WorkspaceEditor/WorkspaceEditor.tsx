import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { Workspace } from '@/types/workspaces';
import { DELETE_WORKSPACE } from '@/graphql/workspaces';
import { Button } from '@/components/Button';
import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { CreateWorkspaceForm } from '@/pages/dashboard/components/WorkspaceForm/CreateWorkspaceForm';

import styles from './WorkspaceEditor.module.css';

type Props = {
    workspace: Workspace;
}

export const WorkspaceEditor = ({ workspace }: Props) => {
    const { t } = useTranslation();
    const { refetch } = useWorkspacesList();
    const [deleteWorkspace] = useMutation(DELETE_WORKSPACE, {
        onCompleted: () => {
            refetch();
        },
        onError: () => {}
    });

    const handleDelete = async () => {
        await deleteWorkspace({
            variables: {
                id: workspace.id
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {workspace.name}
            </div>
            <div className={styles.uuid}>
                {workspace.id}
            </div>
            <div className={styles.controls}>
                <CreateWorkspaceForm 
                    cta={t('common.edit')}
                    title={t('dashboard.workspaces.editTitle')}
                    submitText={t('common.saveChanges')}
                    workspace={workspace}
                />
                <Button onClick={handleDelete} className="text-red-400">
                    {t('common.delete')}
                </Button>
            </div>
        </div>
    )
}; 
