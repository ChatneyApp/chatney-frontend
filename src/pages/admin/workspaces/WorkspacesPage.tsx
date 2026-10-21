import { Suspense, startTransition, useCallback, useEffect, useState } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { GET_WORKSPACES } from '@/graphql/workspaces';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { WebSocketEventType } from '@/communication/WebSocketEventEmitter';

import { WorkspaceFormModal } from './components/WorkspaceFormModal';
import { WorkspacesTable } from './components/WorkspacesTable';
import styles from './WorkspacesPage.module.css';

function WorkspacesPageContent() {
    const { t } = useTranslation();
    const { data, refetch } = useSuspenseQuery(GET_WORKSPACES, {
        fetchPolicy: 'no-cache',
    });
    const { eventEmitter } = useWebsocket();
    const [createOpen, setCreateOpen] = useState(false);

    const handleRefresh = useCallback(() => {
        startTransition(async () => {
            await refetch();
        });
    }, [refetch]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        eventEmitter.addEventListener(WebSocketEventType.NEW_WORKSPACE, handleRefresh, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_WORKSPACE, handleRefresh, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_WORKSPACE, handleRefresh, { signal });

        return () => controller.abort();
    }, [eventEmitter, handleRefresh]);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('admin.workspaces.title')}</h1>
                    <p className={styles.subtitle}>
                        {t('admin.workspaces.subtitle')}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => setCreateOpen(true)}
                >
                    {t('admin.workspaces.create')}
                </button>
            </header>

            <WorkspacesTable workspaces={data.workspaces.list} onChanged={handleRefresh} />

            <WorkspaceFormModal open={createOpen} onOpenChange={setCreateOpen} onSaved={handleRefresh} />
        </div>
    );
}

export function WorkspacesPage() {
    const { t } = useTranslation();

    return (
        <Suspense fallback={<div className={styles.loading}>{t('admin.workspaces.loading')}</div>}>
            <WorkspacesPageContent />
        </Suspense>
    );
}
