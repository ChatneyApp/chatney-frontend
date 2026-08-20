import { Suspense, useState } from 'react';

import { RolesListProvider, useRolesList } from '@/contexts/RolesListContext';

import { RoleFormModal } from './components/RoleFormModal';
import { RolesTable } from './components/RolesTable';
import styles from './RolesPage.module.css';

function RolesPageContent() {
    const { roles } = useRolesList();
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Roles</h1>
                    <p className={styles.subtitle}>
                        Manage access roles and their permissions
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => setCreateOpen(true)}
                >
                    Create role
                </button>
            </header>

            <RolesTable roles={roles} />

            <RoleFormModal open={createOpen} onOpenChange={setCreateOpen} />
        </div>
    );
}

export function RolesPage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading roles...</div>}>
            <RolesListProvider>
                <RolesPageContent />
            </RolesListProvider>
        </Suspense>
    );
}
