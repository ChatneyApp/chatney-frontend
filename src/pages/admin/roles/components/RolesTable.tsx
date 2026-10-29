import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { DELETE_ROLE } from '@/graphql/roles';
import { useRolesList } from '@/contexts/RolesListContext';
import { Role } from '@/types/roles';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import { RoleFormModal } from './RoleFormModal';
import styles from './RolesTable.module.css';

type Props = {
    roles: Role[];
};

export function RolesTable({ roles }: Props) {
    const { t } = useTranslation();
    const { refetch } = useRolesList();
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteRole, { loading: deleteLoading }] = useMutation(DELETE_ROLE);

    const closeDeleteDialog = () => {
        setRoleToDelete(null);
        setDeleteError(null);
    };

    const getDeleteErrorMessage = (error: unknown) => {
        switch (getGraphQLErrorCode(error)) {
            case FORBIDDEN_ACTION:
                return t('admin.roles.errors.deleteForbidden');
            case NOT_FOUND:
                return t('admin.roles.errors.deleteNotFound');
            default:
                return t('admin.roles.errors.deleteFailed');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!roleToDelete) {
            return;
        }

        setDeleteError(null);
        try {
            // A `false` result means the role was already gone, which is what the user asked for.
            await deleteRole({ variables: { id: roleToDelete.id } });
            closeDeleteDialog();
            refetch();
        } catch (error) {
            setDeleteError(getDeleteErrorMessage(error));
        }
    };

    if (!roles.length) {
        return (
            <div className={styles.empty}>
                {t('admin.roles.empty')}
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>{t('admin.roles.columns.role')}</th>
                            <th className={styles.th}>{t('admin.roles.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => {
                            return (
                                <tr key={role.id}>
                                    <td className={styles.td}>
                                        <div className={styles.roleName}>{role.name}</div>
                                        <div className={styles.roleId}>{t('admin.roles.id', { id: role.id })}</div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                onClick={() => setEditingRole(role)}
                                            >
                                                {t('common.edit')}
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => setRoleToDelete(role)}
                                            >
                                                {t('common.delete')}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {editingRole && (
                <RoleFormModal
                    open
                    role={editingRole}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingRole(null);
                        }
                    }}
                />
            )}

            <ConfirmDialog
                open={Boolean(roleToDelete)}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDeleteDialog();
                    }
                }}
                title={t('admin.roles.deleteDialog.title')}
                description={t('admin.roles.deleteDialog.description', { name: roleToDelete?.name })}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                error={deleteError}
            />
        </>
    );
}
