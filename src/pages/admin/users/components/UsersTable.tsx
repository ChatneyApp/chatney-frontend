import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { DELETE_USER } from '@/graphql/adminUsers';
import { useUsersList } from '@/contexts/UsersListContext';
import { useUser } from '@/contexts/UserContext';
import { User } from '@/types/users';
import { getUserDisplayName } from '@/helpers/nickname';

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
    const { t } = useTranslation();
    const { refetch } = useUsersList();
    const currentUser = useUser()?.user;
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deleteUser] = useMutation(DELETE_USER, {
        onCompleted: () => refetch(),
    });

    const handleDelete = async (user: User) => {
        if (user.id === currentUser?.id) {
            return;
        }

        const confirmed = window.confirm(
            t('admin.users.deleteConfirm', { name: getUserDisplayName(user) }),
        );
        if (!confirmed) {
            return;
        }

        await deleteUser({ variables: { id: user.id } });
    };

    if (!users.length) {
        return (
            <div className={styles.empty}>
                {t('admin.users.empty')}
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>{t('admin.users.columns.user')}</th>
                            <th className={styles.th}>{t('admin.users.columns.status')}</th>
                            <th className={styles.th}>{t('admin.users.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            const isSelf = user.id === currentUser?.id;

                            return (
                                <tr key={user.id}>
                                    <td className={styles.td}>
                                        <div className={styles.userName}>
                                            {getUserDisplayName(user)}
                                            {isSelf && ` ${t('admin.users.you')}`}
                                        </div>
                                        <div className={styles.userEmail}>@{user.nickname} · {user.email}</div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.badges}>
                                            <StatusBadge
                                                label={user.active ? t('userStatus.active') : t('userStatus.inactive')}
                                                variant={user.active ? 'positive' : 'neutral'}
                                            />
                                            {user.verified && (
                                                <StatusBadge label={t('userStatus.verified')} variant="positive" />
                                            )}
                                            {user.banned && (
                                                <StatusBadge label={t('userStatus.banned')} variant="danger" />
                                            )}
                                            {user.muted && (
                                                <StatusBadge label={t('userStatus.muted')} variant="warning" />
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
                                                {t('common.edit')}
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => handleDelete(user)}
                                                disabled={isSelf}
                                                title={isSelf ? t('admin.users.cannotDeleteSelf') : undefined}
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
