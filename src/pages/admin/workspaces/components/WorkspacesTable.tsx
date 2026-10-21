import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { DELETE_WORKSPACE } from '@/graphql/workspaces';
import { Workspace } from '@/types/workspaces';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import { WorkspaceFormModal } from './WorkspaceFormModal';
import styles from './WorkspacesTable.module.css';

type Props = {
    workspaces: Workspace[];
    onChanged: () => void;
};

export function WorkspacesTable({ workspaces, onChanged }: Props) {
    const { t, i18n } = useTranslation();
    const [editingWorkspace, setEditingWorkspace] = useState<Workspace | null>(null);
    const [workspaceToDelete, setWorkspaceToDelete] = useState<Workspace | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteWorkspace, { loading: deleteLoading }] = useMutation(DELETE_WORKSPACE);

    const formatDate = (value: string) =>
        DateTime.fromISO(value).setLocale(i18n.language).toLocaleString(DateTime.DATETIME_MED);

    const closeDeleteDialog = () => {
        setWorkspaceToDelete(null);
        setDeleteError(null);
    };

    const getDeleteErrorMessage = (error: unknown) => {
        switch (getGraphQLErrorCode(error)) {
            case FORBIDDEN_ACTION:
                return t('admin.workspaces.errors.deleteForbidden');
            case NOT_FOUND:
                return t('admin.workspaces.errors.deleteNotFound');
            default:
                return t('admin.workspaces.errors.deleteFailed');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!workspaceToDelete) {
            return;
        }

        setDeleteError(null);
        try {
            // A `false` result means the workspace was already gone, which is what the user asked for.
            await deleteWorkspace({ variables: { id: workspaceToDelete.id } });
            closeDeleteDialog();
            onChanged();
        } catch (error) {
            setDeleteError(getDeleteErrorMessage(error));
        }
    };

    if (!workspaces.length) {
        return (
            <div className={styles.empty}>
                {t('admin.workspaces.empty')}
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>{t('admin.workspaces.columns.workspace')}</th>
                            <th className={styles.th}>{t('admin.workspaces.columns.created')}</th>
                            <th className={styles.th}>{t('admin.workspaces.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {workspaces.map((workspace) => (
                            <tr key={workspace.id}>
                                <td className={styles.td}>
                                    <div className={styles.workspaceName}>{workspace.name}</div>
                                    <div className={styles.workspaceId}>{t('admin.workspaces.id', { id: workspace.id })}</div>
                                </td>
                                <td className={`${styles.td} ${styles.date}`}>
                                    {formatDate(workspace.createdAt)}
                                </td>
                                <td className={styles.td}>
                                    <div className={styles.actions}>
                                        <button
                                            type="button"
                                            className={`${styles.actionButton} ${styles.editButton}`}
                                            onClick={() => setEditingWorkspace(workspace)}
                                        >
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={() => setWorkspaceToDelete(workspace)}
                                        >
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingWorkspace && (
                <WorkspaceFormModal
                    open
                    workspace={editingWorkspace}
                    onSaved={onChanged}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingWorkspace(null);
                        }
                    }}
                />
            )}

            <ConfirmDialog
                open={Boolean(workspaceToDelete)}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDeleteDialog();
                    }
                }}
                title={t('admin.workspaces.deleteDialog.title')}
                description={t('admin.workspaces.deleteDialog.description', { name: workspaceToDelete?.name })}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                error={deleteError}
            />
        </>
    );
}
