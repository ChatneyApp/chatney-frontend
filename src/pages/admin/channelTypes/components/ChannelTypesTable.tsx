import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';

import { DELETE_CHANNEL_TYPE } from '@/graphql/channelTypes';
import { ChannelType } from '@/types/channelTypes';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import { ChannelTypeFormModal } from './ChannelTypeFormModal';
import styles from './ChannelTypesTable.module.css';

type Props = {
    channelTypes: ChannelType[];
    onChanged: () => void;
};

export function ChannelTypesTable({ channelTypes, onChanged }: Props) {
    const { t, i18n } = useTranslation();
    const [editingChannelType, setEditingChannelType] = useState<ChannelType | null>(null);
    const [channelTypeToDelete, setChannelTypeToDelete] = useState<ChannelType | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteChannelType, { loading: deleteLoading }] = useMutation(DELETE_CHANNEL_TYPE);

    const formatDate = (value: string) =>
        DateTime.fromISO(value).setLocale(i18n.language).toLocaleString(DateTime.DATETIME_MED);

    const closeDeleteDialog = () => {
        setChannelTypeToDelete(null);
        setDeleteError(null);
    };

    const getDeleteErrorMessage = (error: unknown) => {
        switch (getGraphQLErrorCode(error)) {
            case FORBIDDEN_ACTION:
                return t('admin.channelTypes.errors.deleteForbidden');
            case NOT_FOUND:
                return t('admin.channelTypes.errors.deleteNotFound');
            default:
                return t('admin.channelTypes.errors.deleteFailed');
        }
    };

    const handleDeleteConfirm = async () => {
        if (!channelTypeToDelete) {
            return;
        }

        setDeleteError(null);
        try {
            // A `false` result means the channel type was already gone, which is what the user asked for.
            await deleteChannelType({ variables: { id: channelTypeToDelete.id } });
            closeDeleteDialog();
            onChanged();
        } catch (error) {
            setDeleteError(getDeleteErrorMessage(error));
        }
    };

    if (!channelTypes.length) {
        return (
            <div className={styles.empty}>
                {t('admin.channelTypes.empty')}
            </div>
        );
    }

    return (
        <>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={styles.th}>{t('admin.channelTypes.columns.channelType')}</th>
                            <th className={styles.th}>{t('admin.channelTypes.columns.key')}</th>
                            <th className={styles.th}>{t('admin.channelTypes.columns.created')}</th>
                            <th className={styles.th}>{t('admin.channelTypes.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tbody}>
                        {channelTypes.map((channelType) => (
                            <tr key={channelType.id}>
                                <td className={styles.td}>
                                    <div className={styles.name}>{channelType.name}</div>
                                    <div className={styles.id}>{t('admin.channelTypes.id', { id: channelType.id })}</div>
                                </td>
                                <td className={`${styles.td} ${styles.key}`}>
                                    {channelType.key}
                                </td>
                                <td className={`${styles.td} ${styles.date}`}>
                                    {formatDate(channelType.createdAt)}
                                </td>
                                <td className={styles.td}>
                                    <div className={styles.actions}>
                                        <button
                                            type="button"
                                            className={`${styles.actionButton} ${styles.editButton}`}
                                            onClick={() => setEditingChannelType(channelType)}
                                        >
                                            {t('common.edit')}
                                        </button>
                                        <button
                                            type="button"
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={() => setChannelTypeToDelete(channelType)}
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

            {editingChannelType && (
                <ChannelTypeFormModal
                    open
                    channelType={editingChannelType}
                    onSaved={onChanged}
                    onOpenChange={(open) => {
                        if (!open) {
                            setEditingChannelType(null);
                        }
                    }}
                />
            )}

            <ConfirmDialog
                open={Boolean(channelTypeToDelete)}
                onOpenChange={(open) => {
                    if (!open) {
                        closeDeleteDialog();
                    }
                }}
                title={t('admin.channelTypes.deleteDialog.title')}
                description={t('admin.channelTypes.deleteDialog.description', { name: channelTypeToDelete?.name })}
                onConfirm={handleDeleteConfirm}
                loading={deleteLoading}
                error={deleteError}
            />
        </>
    );
}
