import { Suspense, startTransition, useCallback, useEffect, useState } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

import { GET_WORKSPACES } from '@/graphql/workspaces';
import { GET_WORKSPACE_CHANNELS } from '@/graphql/channels';
import { GET_CHANNEL_TYPES } from '@/graphql/channelTypes';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import {
    ChannelDeletedPayload,
    ChannelPayload,
    WebSocketEvent,
    WebSocketEventType,
} from '@/communication/WebSocketEventEmitter';
import { Workspace } from '@/types/workspaces';
import { sortById } from '@/helpers/utils';

import { ChannelFormModal } from './components/ChannelFormModal';
import { ChannelsTable } from './components/ChannelsTable';
import styles from './WorkspaceChannelsPage.module.css';

function BackLink() {
    const { t } = useTranslation();

    return (
        <Link to="/admin/workspaces" className={styles.backLink}>
            <ArrowLeft size={14} />
            {t('admin.workspaceChannels.back')}
        </Link>
    );
}

type EditorProps = {
    workspace: Workspace;
};

function WorkspaceChannelsEditor({ workspace }: EditorProps) {
    const { t } = useTranslation();
    // `all` keeps a NOT_FOUND (the workspace was just deleted) from throwing while the page catches up.
    const { data: channelsData, refetch: refetchChannels } = useSuspenseQuery(GET_WORKSPACE_CHANNELS, {
        variables: { workspaceId: workspace.id },
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    });
    const { data: channelTypesData, refetch: refetchChannelTypes } = useSuspenseQuery(GET_CHANNEL_TYPES, {
        fetchPolicy: 'no-cache',
    });
    const { eventEmitter } = useWebsocket();
    const [createOpen, setCreateOpen] = useState(false);

    const channels = sortById((channelsData?.channels.workspaceChannelList ?? []).filter(channel => !channel.isDm));
    const channelTypes = sortById(channelTypesData.channels.channelTypeList.filter(channelType => channelType.key !== 'dm'));

    const handleChannelsRefresh = useCallback(() => {
        startTransition(async () => {
            await refetchChannels();
        });
    }, [refetchChannels]);

    const handleChannelTypesRefresh = useCallback(() => {
        startTransition(async () => {
            await refetchChannelTypes();
        });
    }, [refetchChannelTypes]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        const onChannelChanged = (event: WebSocketEvent) => {
            const channel = event.payload as ChannelPayload | ChannelDeletedPayload;
            if (channel.workspaceId === workspace.id) {
                handleChannelsRefresh();
            }
        };

        eventEmitter.addEventListener(WebSocketEventType.NEW_CHANNEL, onChannelChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_CHANNEL, onChannelChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_CHANNEL, onChannelChanged, { signal });
        eventEmitter.addEventListener(WebSocketEventType.NEW_CHANNEL_TYPE, handleChannelTypesRefresh, { signal });
        eventEmitter.addEventListener(WebSocketEventType.UPDATED_CHANNEL_TYPE, handleChannelTypesRefresh, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_CHANNEL_TYPE, handleChannelTypesRefresh, { signal });

        return () => controller.abort();
    }, [eventEmitter, workspace.id, handleChannelsRefresh, handleChannelTypesRefresh]);

    return (
        <div className={styles.page}>
            <BackLink />
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        {t('admin.workspaceChannels.title', { workspace: workspace.name })}
                    </h1>
                    <p className={styles.subtitle}>
                        {t('admin.workspaceChannels.subtitle')}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.createButton}
                    disabled={!channelTypes.length}
                    onClick={() => setCreateOpen(true)}
                >
                    {t('admin.workspaceChannels.create')}
                </button>
            </header>

            <ChannelsTable channels={channels} channelTypes={channelTypes} onChanged={handleChannelsRefresh} />

            <ChannelFormModal
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSaved={handleChannelsRefresh}
                workspaceId={workspace.id}
                channelTypes={channelTypes}
            />
        </div>
    );
}

type ContentProps = {
    workspaceId: number;
};

function WorkspaceChannelsPageContent({ workspaceId }: ContentProps) {
    const { t } = useTranslation();
    const { data, refetch } = useSuspenseQuery(GET_WORKSPACES, {
        fetchPolicy: 'no-cache',
    });
    const { eventEmitter } = useWebsocket();

    const handleRefresh = useCallback(() => {
        startTransition(async () => {
            await refetch();
        });
    }, [refetch]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;

        eventEmitter.addEventListener(WebSocketEventType.UPDATED_WORKSPACE, handleRefresh, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_WORKSPACE, handleRefresh, { signal });

        return () => controller.abort();
    }, [eventEmitter, handleRefresh]);

    const workspace = data.workspaces.list.find(listed => listed.id === workspaceId);

    if (!workspace) {
        return (
            <div className={styles.page}>
                <BackLink />
                <div className={styles.notFound}>{t('admin.workspaceChannels.notFound')}</div>
            </div>
        );
    }

    return <WorkspaceChannelsEditor workspace={workspace} />;
}

export function WorkspaceChannelsPage() {
    const { t } = useTranslation();
    const params = useParams();
    // A malformed id matches no workspace and ends up on the not-found message.
    const workspaceId = Number(params.workspaceId);

    return (
        <Suspense fallback={<div className={styles.loading}>{t('admin.workspaceChannels.loading')}</div>}>
            <WorkspaceChannelsPageContent workspaceId={workspaceId} />
        </Suspense>
    );
}
