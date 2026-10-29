import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { RolesListProvider, useRolesList } from '@/contexts/RolesListContext';

import { RoleFormModal } from './components/RoleFormModal';
import { RolesTable } from './components/RolesTable';
import styles from './RolesPage.module.css';

function RolesPageContent() {
    const { t } = useTranslation();
    const { roles } = useRolesList();
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('admin.roles.title')}</h1>
                    <p className={styles.subtitle}>
                        {t('admin.roles.subtitle')}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => setCreateOpen(true)}
                >
                    {t('admin.roles.create')}
                </button>
            </header>

            <RolesTable roles={roles} />

            <RoleFormModal open={createOpen} onOpenChange={setCreateOpen} />
        </div>
    );
}

export function RolesPage() {
    const { t } = useTranslation();

    return (
        <Suspense fallback={<div className={styles.loading}>{t('admin.roles.loading')}</div>}>
            <RolesListProvider>
                <RolesPageContent />
            </RolesListProvider>
        </Suspense>
    );
}
