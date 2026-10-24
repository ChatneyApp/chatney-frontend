import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { DELETE_CHANNEL_GROUP } from '@/graphql/channelGroups';
import { Channel } from '@/types/channels';
import { ChannelGroup } from '@/types/channelGroups';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import { ChannelGroupFormModal } from './ChannelGroupFormModal';
import styles from './ChannelGroupsTable.module.css';

type Props = {
    channelGroups: ChannelGroup[];
    channels: Channel[];
    onChanged: () => void;
};

export function ChannelGroupsTable({ channelGroups, channels, onChanged }: Props) {
    const { t, i18n } = useTranslation();
    const [editingGroup, setEditingGroup] = useState<ChannelGroup | null>(null);
    const [groupToDelete, setGroupToDelete] = useState<ChannelGroup | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteChannelGroup, { loading: deleteLoading }] = useMutation(DELETE_CHANNEL_GROUP);

    const formatDate = (value: string) =>
        DateTime.fromISO(value).setLocale(i18n.language).toLocaleString(DateTime.DATETIME_MED);

    // Ids of deleted channels can linger in a group; they are skipped.
    const getChannelNames = (channelGroup: ChannelGroup) => channelGroup.channelIds
        .map(id => channels.find(channel => channel.id === id)?.name)
        .filter(name => name !== undefined);

    const closeDeleteDialog = () => {
        setGroupToDelete(null);
        setDeleteError(null);
    };

    const getDeleteErrorMessage = (error: unknown) => {
        switch (getGraphQLErrorCode(error)) {
            case FORBIDDEN_ACTION:
                return t('admin.workspaceChannelGroups.errors.deleteForbidden');
            case NOT_FOUND:
                return t('admin.workspaceChannelGroups.errors.deleteNotFound');
            default:
                return t('admin.workspaceChannelGroups.errors.deleteFailed');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!groupToDelete) {
            return;
        }

        setDeleteError(null);
        try {
            // A `false` result means the group was already gone, which is what the user asked for.
            await deleteChannelGroup({ variables: { id: groupToDelete.id } });
            closeDeleteDialog();
            onChanged();
        } catch (error) {
            setDeleteError(getDeleteErrorMessage(error));
        }
    };

    if (!channelGroups.length) {
        return (
            <div className={styles.empty}>
                {t('admin.workspaceChannelGroups.empty')}
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.group')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.channels')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.created')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {channelGroups.map((channelGroup) => {
                            const channelNames = getChannelNames(channelGroup);

                            return (
                                <tr key={channelGroup.id}>
                                    <td className={styles.td}>
                                        <div className={styles.groupName}>{channelGroup.name}</div>
                                        <div className={styles.groupId}>
                                            {t('admin.workspaceChannelGroups.id', { id: channelGroup.id })}
                                        </div>
                                    </td>
                                    <td className={`${styles.td} ${styles.channelNames}`}>
                                        {channelNames.length
                                            ? channelNames.join(', ')
                                            : t('admin.workspaceChannelGroups.noChannels')}
                                    </td>
                                    <td className={`${styles.td} ${styles.date}`}>
                                        {formatDate(channelGroup.createdAt)}
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.editButton}`}
                                                onClick={() => setEditingGroup(channelGroup)}
                                            >
                                                {t('common.edit')}
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                onClick={() => setGroupToDelete(channelGroup)}
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

            {editingGroup && (
                <ChannelGroupFormModal
                    open
                    channelGroup={editingGroup}
                    workspaceId={editingGroup.workspaceId}
                    channels={channels}
                    channelGroups={channelGroups}
                    onSaved={onChanged}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingGroup(null);
                        }
                    }}
                />
            )}

            <ConfirmDialog
                open={Boolean(groupToDelete)}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDeleteDialog();
                    }
                }}
                title={t('admin.workspaceChannelGroups.deleteDialog.title')}
                description={t('admin.workspaceChannelGroups.deleteDialog.description', { name: groupToDelete?.name })}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                error={deleteError}
            />
        </>
    );
}
