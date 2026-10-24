import { Suspense, startTransition, useCallback, useEffect, useState } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { GET_CHANNEL_TYPES } from '@/graphql/channelTypes';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { WebSocketEventType } from '@/communication/WebSocketEventEmitter';
import { sortById } from '@/helpers/utils';

import { ChannelTypeFormModal } from './components/ChannelTypeFormModal';
import { ChannelTypesTable } from './components/ChannelTypesTable';
import styles from './ChannelTypesPage.module.css';

function ChannelTypesPageContent() {
    const { t } = useTranslation();
    const { data, refetch } = useSuspenseQuery(GET_CHANNEL_TYPES, {
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

        eventEmitter.addEventListener(WebSocketEventType.NEW_CHANNEL_TYPE, handleRefresh, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_CHANNEL_TYPE, handleRefresh, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_CHANNEL_TYPE, handleRefresh, { signal });

        return () => controller.abort();
    }, [eventEmitter, handleRefresh]);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{t('admin.channelTypes.title')}</h1>
                    <p className={styles.subtitle}>
                        {t('admin.channelTypes.subtitle')}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => setCreateOpen(true)}
                >
                    {t('admin.channelTypes.create')}
                </button>
            </header>

            <ChannelTypesTable channelTypes={sortById(data.channels.channelTypeList)} onChanged={handleRefresh} />

            <ChannelTypeFormModal open={createOpen} onOpenChange={setCreateOpen} onSaved={handleRefresh} />
        </div>
    );
}

export function ChannelTypesPage() {
    const { t } = useTranslation();

    return (
        <Suspense fallback={<div className={styles.loading}>{t('admin.channelTypes.loading')}</div>}>
            <ChannelTypesPageContent />
        </Suspense>
    );
}
