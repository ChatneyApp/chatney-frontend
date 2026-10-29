import { Suspense, startTransition, useCallback, useEffect, useState } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

import { GET_WORKSPACES } from '@/graphql/workspaces';
import { GET_WORKSPACE_CHANNELS } from '@/graphql/channels';
import { GET_WORKSPACE_CHANNEL_GROUPS } from '@/graphql/channelGroups';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import {
    ChannelDeletedPayload,
    ChannelPayload,
    WebSocketEvent,
    WebSocketEventType,
} from '@/communication/WebSocketEventEmitter';
import { Workspace } from '@/types/workspaces';
import { sortById } from '@/helpers/utils';

import { ChannelGroupFormModal } from './components/ChannelGroupFormModal';
import { ChannelGroupsTable } from './components/ChannelGroupsTable';
import styles from './WorkspaceChannelGroupsPage.module.css';

function BackLink() {
    const { t } = useTranslation();

    return (
        <Link to="/admin/workspaces" className={styles.backLink}>
            <ArrowLeft size={14} />
            {t('admin.workspaceChannelGroups.back')}
        </Link>
    );
}

type EditorProps = {
    workspace: Workspace;
};

function WorkspaceChannelGroupsEditor({ workspace }: EditorProps) {
    const { t } = useTranslation();
    // `all` keeps a NOT_FOUND (the workspace was just deleted) from throwing while the page catches up.
    const { data: channelGroupsData, refetch: refetchChannelGroups } = useSuspenseQuery(GET_WORKSPACE_CHANNEL_GROUPS, {
        variables: { workspaceId: workspace.id },
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    });
    const { data: channelsData, refetch: refetchChannels } = useSuspenseQuery(GET_WORKSPACE_CHANNELS, {
        variables: { workspaceId: workspace.id },
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
    });
    const { eventEmitter } = useWebsocket();
    const [createOpen, setCreateOpen] = useState(false);

    const channelGroups = [...(channelGroupsData?.channels.workspaceChannelGroupList ?? [])]
        .sort((a, b) => a.order - b.order || a.id - b.id);
    const channels = sortById((channelsData?.channels.workspaceChannelList ?? []).filter(channel => !channel.isDm));

    // The backend doesn't broadcast channel group changes, so the groups are refetched after every save.
    const handleChannelGroupsRefresh = useCallback(() => {
        startTransition(async () => {
            await refetchChannelGroups();
        });
    }, [refetchChannelGroups]);

    const handleChannelsRefresh = useCallback(() => {
        startTransition(async () => {
            await refetchChannels();
        });
    }, [refetchChannels]);

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

        return () => controller.abort();
    }, [eventEmitter, workspace.id, handleChannelsRefresh]);

    return (
        <div className={styles.page}>
            <BackLink />
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        {t('admin.workspaceChannelGroups.title', { workspace: workspace.name })}
                    </h1>
                    <p className={styles.subtitle}>
                        {t('admin.workspaceChannelGroups.subtitle')}
                    </p>
                </div>
                <button
                    type="button"
                    className={styles.createButton}
                    onClick={() => setCreateOpen(true)}
                >
                    {t('admin.workspaceChannelGroups.create')}
                </button>
            </header>

            <ChannelGroupsTable
                channelGroups={channelGroups}
                channels={channels}
                onChanged={handleChannelGroupsRefresh}
            />

            <ChannelGroupFormModal
                open={createOpen}
                onOpenChange={setCreateOpen}
                onSaved={handleChannelGroupsRefresh}
                workspaceId={workspace.id}
                channels={channels}
                channelGroups={channelGroups}
            />
        </div>
    );
}

type ContentProps = {
    workspaceId: number;
};

function WorkspaceChannelGroupsPageContent({ workspaceId }: ContentProps) {
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
                <div className={styles.notFound}>{t('admin.workspaceChannelGroups.notFound')}</div>
            </div>
        );
    }

    return <WorkspaceChannelGroupsEditor workspace={workspace} />;
}

export function WorkspaceChannelGroupsPage() {
    const { t } = useTranslation();
    const params = useParams();
    // A malformed id matches no workspace and ends up on the not-found message.
    const workspaceId = Number(params.workspaceId);

    return (
        <Suspense fallback={<div className={styles.loading}>{t('admin.workspaceChannelGroups.loading')}</div>}>
            <WorkspaceChannelGroupsPageContent workspaceId={workspaceId} />
        </Suspense>
    );
}
