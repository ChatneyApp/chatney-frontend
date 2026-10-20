import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RolesListProvider } from '@/contexts/RolesListContext';
import { UsersListProvider, useUsersList } from '@/contexts/UsersListContext';

import { UserFormModal } from './components/UserFormModal';
import { UsersTable } from './components/UsersTable';
import styles from './UsersPage.module.css';

function UsersPageContent() {
    const { t } = useTranslation();
    const { users } = useUsersList();
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('admin.users.title')}</h1>
                    <p className={styles.subtitle}>
                        {t('admin.users.subtitle')}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => setCreateOpen(true)}
                >
                    {t('admin.users.create')}
                </button>
            </header>

            <UsersTable users={users} />

            <UserFormModal open={createOpen} onOpenChange={setCreateOpen} />
        </div>
    );
}

export function UsersPage() {
    const { t } = useTranslation();

    return (
        <Suspense fallback={<div className={styles.loading}>{t('admin.users.loading')}</div>}>
            <RolesListProvider>
                <UsersListProvider>
                    <UsersPageContent />
                </UsersListProvider>
            </RolesListProvider>
        </Suspense>
    );
}
