import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { DELETE_ROLE } from '@/graphql/roles';
import { formatPermissionLabel } from '@/helpers/permissions';
import { useRolesList } from '@/contexts/RolesListContext';
import { Role } from '@/types/roles';

import { RoleFormModal } from './RoleFormModal';
import styles from './RolesTable.module.css';

const VISIBLE_PERMISSIONS = 4;

type Props = {
    roles: Role[];
};

export function RolesTable({ roles }: Props) {
    const { refetch } = useRolesList();
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [deleteRole] = useMutation(DELETE_ROLE, {
        onCompleted: () => refetch(),
    });

    const handleDelete = async (role: Role) => {
        if (role.isProtected) {
            return;
        }

        const confirmed = window.confirm(
            `Delete role "${role.name}"? This action cannot be undone.`,
        );
        if (!confirmed) {
            return;
        }

        await deleteRole({ variables: { id: role.id } });
    };

    if (!roles.length) {
        return (
            <div className={styles.empty}>
                No roles yet. Create the first role to get started.
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>Role</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Permissions</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => {
                            const visiblePermissions = role.permissions.slice(0, VISIBLE_PERMISSIONS);
                            const hiddenCount = role.permissions.length - visiblePermissions.length;

                            return (
                                <tr key={role.id}>
                                    <td className={styles.td}>
                                        <div className={styles.roleName}>{role.name}</div>
                                        <div className={styles.roleId}>ID {role.id}</div>
                                    </td>
                                    <td className={styles.td}>
                                        <span
                                            className={
                                                role.isProtected
                                                    ? `${styles.badge} ${styles.badgeProtected}`
                                                    : `${styles.badge} ${styles.badgeCustom}`
                                            }
                                        >
                                            {role.isProtected ? 'Protected' : 'Custom'}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.permissions}>
                                            {visiblePermissions.map((permission) => (
                                                <span
                                                    key={permission}
                                                    className={styles.permissionTag}
                                                    title={permission}
                                                >
                                                    {formatPermissionLabel(permission)}
                                                </span>
                                            ))}
                                            {hiddenCount > 0 && (
                                                <span className={styles.permissionMore}>
                                                    +{hiddenCount} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                onClick={() => setEditingRole(role)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => handleDelete(role)}
                                                disabled={role.isProtected}
                                                title={
                                                    role.isProtected
                                                        ? 'Protected roles cannot be deleted'
                                                        : undefined
                                                }
                                            >
                                                Delete
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
        </>
    );
}
