import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { DELETE_ROLE } from '@/graphql/roles';
import { useRolesList } from '@/contexts/RolesListContext';
import { Role } from '@/types/roles';

import { RoleFormModal } from './RoleFormModal';
import styles from './RolesTable.module.css';

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
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => {
                            return (
                                <tr key={role.id}>
                                    <td className={styles.td}>
                                        <div className={styles.roleName}>{role.name}</div>
                                        <div className={styles.roleId}>ID {role.id}</div>
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
