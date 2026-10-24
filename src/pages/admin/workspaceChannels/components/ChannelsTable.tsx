import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { DELETE_CHANNEL } from '@/graphql/channels';
import { Channel } from '@/types/channels';
import { ChannelType } from '@/types/channelTypes';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import { ChannelFormModal } from './ChannelFormModal';
import styles from './ChannelsTable.module.css';

type Props = {
    channels: Channel[];
    channelTypes: ChannelType[];
    onChanged: () => void;
};

export function ChannelsTable({ channels, channelTypes, onChanged }: Props) {
    const { t, i18n } = useTranslation();
    const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
    const [channelToDelete, setChannelToDelete] = useState<Channel | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteChannel, { loading: deleteLoading }] = useMutation(DELETE_CHANNEL);

    const formatDate = (value: string) =>
        DateTime.fromISO(value).setLocale(i18n.language).toLocaleString(DateTime.DATETIME_MED);

    const getChannelTypeName = (channel: Channel) =>
        channelTypes.find(channelType => channelType.id === channel.channelTypeId)?.name
            ?? t('admin.workspaceChannels.unknownType');

    const closeDeleteDialog = () => {
        setChannelToDelete(null);
        setDeleteError(null);
    };

    const getDeleteErrorMessage = (error: unknown) => {
        switch (getGraphQLErrorCode(error)) {
            case FORBIDDEN_ACTION:
                return t('admin.workspaceChannels.errors.deleteForbidden');
            case NOT_FOUND:
                return t('admin.workspaceChannels.errors.deleteNotFound');
            default:
                return t('admin.workspaceChannels.errors.deleteFailed');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!channelToDelete) {
            return;
        }

        setDeleteError(null);
        try {
            // A `false` result means the channel was already gone, which is what the user asked for.
            await deleteChannel({ variables: { id: channelToDelete.id } });
            closeDeleteDialog();
            onChanged();
        } catch (error) {
            setDeleteError(getDeleteErrorMessage(error));
        }
    };

    if (!channels.length) {
        return (
            <div className={styles.empty}>
                {t('admin.workspaceChannels.empty')}
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>{t('admin.workspaceChannels.columns.channel')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannels.columns.type')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannels.columns.created')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannels.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {channels.map((channel) => (
                            <tr key={channel.id}>
                                <td className={styles.td}>
                                    <div className={styles.channelName}>{channel.name}</div>
                                    <div className={styles.channelId}>{t('admin.workspaceChannels.id', { id: channel.id })}</div>
                                </td>
                                <td className={`${styles.td} ${styles.channelType}`}>
                                    {getChannelTypeName(channel)}
                                </td>
                                <td className={`${styles.td} ${styles.date}`}>
                                    {formatDate(channel.createdAt)}
                                </td>
                                <td className={styles.td}>
                                    <div className={styles.actions}>
                                        <button
                                            type="button"
                                            className={`${styles.actionButton} ${styles.editButton}`}
                                            onClick={() => setEditingChannel(channel)}
                                        >
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={() => setChannelToDelete(channel)}
                                        >
                                            {t('common.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {editingChannel && editingChannel.workspaceId !== null && (
                <ChannelFormModal
                    open
                    channel={editingChannel}
                    workspaceId={editingChannel.workspaceId}
                    channelTypes={channelTypes}
                    onSaved={onChanged}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingChannel(null);
                        }
                    }}
                />
            )}

            <ConfirmDialog
                open={Boolean(channelToDelete)}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDeleteDialog();
                    }
                }}
                title={t('admin.workspaceChannels.deleteDialog.title')}
                description={t('admin.workspaceChannels.deleteDialog.description', { name: channelToDelete?.name })}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                error={deleteError}
            />
        </>
    );
}
