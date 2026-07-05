import { useState } from 'react';
import { useMutation } from '@apollo/client/react';

import { DELETE_USER } from '@/graphql/adminUsers';
import { useUsersList } from '@/contexts/UsersListContext';
import { useRolesList } from '@/contexts/RolesListContext';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/types/users';

import { UserFormModal } from './UserFormModal';
import styles from './UsersTable.module.css';

type Props = {
    users: User[];
};

function StatusBadge({
    label,
    variant,
}: {
    label: string;
    variant: 'positive' | 'neutral' | 'warning' | 'danger';
}) {
    const variantClass = {
        positive: styles.badgePositive,
        neutral: styles.badgeNeutral,
        warning: styles.badgeWarning,
        danger: styles.badgeDanger,
    }[variant];

    return (
        <span className={`${styles.badge} ${variantClass}`}>{label}</span>
    );
}

export function UsersTable({ users }: Props) {
    const { refetch } = useUsersList();
    const { roles } = useRolesList();
    const currentUser = useUser()?.user;
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted: () => refetch(),
    });

    const getRoleName = (roleId?: number) =>
        roles.find((role) => role.id === roleId)?.name ?? 'Unknown';

    const handleDelete = async (user: User) => {
        if (user.id === currentUser?.id) {
            return;
        }

        const confirmed = window.confirm(
            `Delete user "${user.name}"? This action cannot be undone.`,
        );
        if (!confirmed) {
            return;
        }

        await deleteUser({ variables: { id: user.id } });
    };

    if (!users.length) {
        return (
            <div className={styles.empty}>
                No users found. Create the first user to get started.
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>User</th>
                            <th className={styles.th}>Role</th>
                            <th className={styles.th}>Status</th>
                            <th className={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const isSelf = user.id === currentUser?.id;

                            return (
                                <tr key={user.id}>
                                    <td className={styles.td}>
                                        <div className={styles.userName}>
                                            {user.name}
                                            {isSelf && ' (you)'}
                                        </div>
                                        <div className={styles.userEmail}>{user.email}</div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.roleName}>
                                            {getRoleName(user.roleId)}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.badges}>
                                            <StatusBadge
                                                label={user.active ? 'Active' : 'Inactive'}
                                                variant={user.active ? 'positive' : 'neutral'}
                                            />
                                            {user.verified && (
                                                <StatusBadge label="Verified" variant="positive" />
                                            )}
                                            {user.banned && (
                                                <StatusBadge label="Banned" variant="danger" />
                                            )}
                                            {user.muted && (
                                                <StatusBadge label="Muted" variant="warning" />
                                            )}
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                onClick={() => setEditingUser(user)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => handleDelete(user)}
                                                disabled={isSelf}
                                                title={isSelf ? 'You cannot delete your own account' : undefined}
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

            {editingUser && (
                <UserFormModal
                    key={editingUser.id}
                    open
                    user={editingUser}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingUser(null);
                        }
                    }}
                />
            )}
        </>
    );
}
