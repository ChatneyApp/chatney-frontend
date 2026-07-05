import { Suspense, useState } from 'react';

import { RolesListProvider } from '@/contexts/RolesListContext';
import { UsersListProvider, useUsersList } from '@/contexts/UsersListContext';

import { UserFormModal } from './components/UserFormModal';
import { UsersTable } from './components/UsersTable';
import styles from './UsersPage.module.css';

function UsersPageContent() {
    const { users } = useUsersList();
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Users</h1>
                    <p className={styles.subtitle}>
                        Manage user accounts, roles, and access status
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => setCreateOpen(true)}
                >
                    Create user
                </button>
            </header>

            <UsersTable users={users} />

            <UserFormModal open={createOpen} onOpenChange={setCreateOpen} />
        </div>
    );
}

export function UsersPage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading users...</div>}>
            <RolesListProvider>
                <UsersListProvider>
                    <UsersPageContent />
                </UsersListProvider>
            </RolesListProvider>
        </Suspense>
    );
}
