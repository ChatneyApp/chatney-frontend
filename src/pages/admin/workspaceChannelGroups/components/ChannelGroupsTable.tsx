import { PointerEvent, useRef, useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { DateTime } from 'luxon';
import { GripHorizontal } from 'lucide-react';

import { DELETE_CHANNEL_GROUP, UPDATE_CHANNEL_GROUPS_ORDER } from '@/graphql/channelGroups';
import { Channel } from '@/types/channels';
import { ChannelGroup } from '@/types/channelGroups';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';
import { moveItem } from '@/helpers/utils';

import { ChannelGroupFormModal } from './ChannelGroupFormModal';
import styles from './ChannelGroupsTable.module.css';

type Props = {
    channelGroups: ChannelGroup[];
    channels: Channel[];
    onChanged: () => void;
};

type DragState = {
    fromIndex: number;
    toIndex: number;
    // Vertical centers of the rows when the drag started, in viewport coordinates.
    rowCenters: number[];
    // The dragged row's edges when the drag started, in viewport coordinates.
    draggedTop: number;
    draggedBottom: number;
    // How far the rows the dragged one passes shift to make room for it.
    rowHeight: number;
    startY: number;
    // How far the dragged row has moved; kept within the table body.
    offsetY: number;
    minOffsetY: number;
    maxOffsetY: number;
};

type PendingOrder = {
    groups: ChannelGroup[];
    basis: ChannelGroup[];
};

export function ChannelGroupsTable({ channelGroups, channels, onChanged }: Props) {
    const { t, i18n } = useTranslation();
    const [editingGroup, setEditingGroup] = useState<ChannelGroup | null>(null);
    const [groupToDelete, setGroupToDelete] = useState<ChannelGroup | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [deleteChannelGroup, { loading: deleteLoading }] = useMutation(DELETE_CHANNEL_GROUP);
    const [updateChannelGroupsOrder, { loading: reorderLoading }] = useMutation(UPDATE_CHANNEL_GROUPS_ORDER);
    const [drag, setDrag] = useState<DragState | null>(null);
    const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
    const [reorderError, setReorderError] = useState<string | null>(null);
    const tbodyRef = useRef<HTMLTableSectionElement>(null);

    // A saved order is shown until the refetched list replaces `channelGroups`.
    const orderedGroups = pendingOrder?.basis === channelGroups ? pendingOrder.groups : channelGroups;

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

    const handleDragStart = (event: PointerEvent<HTMLButtonElement>, index: number) => {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        setReorderError(null);

        const tbody = tbodyRef.current;
        if (!tbody) {
            return;
        }

        const rowRects = [...tbody.rows].map(row => row.getBoundingClientRect());
        const tbodyRect = tbody.getBoundingClientRect();
        const draggedRect = rowRects[index];
        setDrag({
            fromIndex: index,
            toIndex: index,
            rowCenters: rowRects.map(rect => rect.top + rect.height / 2),
            draggedTop: draggedRect.top,
            draggedBottom: draggedRect.bottom,
            rowHeight: draggedRect.height,
            startY: event.clientY,
            offsetY: 0,
            minOffsetY: tbodyRect.top - draggedRect.top,
            maxOffsetY: tbodyRect.bottom - draggedRect.bottom,
        });
    };

    const handleDragMove = (event: PointerEvent<HTMLButtonElement>) => {
        if (!drag) {
            return;
        }

        const offsetY = Math.min(Math.max(event.clientY - drag.startY, drag.minOffsetY), drag.maxOffsetY);
        // A row counts as passed once the dragged row's leading edge crosses its middle.
        const { fromIndex, rowCenters } = drag;
        const toIndex = offsetY >= 0
            ? fromIndex + rowCenters.filter((center, index) => index > fromIndex && center < drag.draggedBottom + offsetY).length
            : fromIndex - rowCenters.filter((center, index) => index < fromIndex && center > drag.draggedTop + offsetY).length;
        setDrag({ ...drag, offsetY, toIndex });
    };

    // While dragging, the rows keep their DOM order: the dragged one follows the pointer
    // and the ones it has passed slide over by its height.
    const getRowShift = (index: number) => {
        if (!drag) {
            return 0;
        }
        if (index === drag.fromIndex) {
            return drag.offsetY;
        }
        if (index > drag.fromIndex && index <= drag.toIndex) {
            return -drag.rowHeight;
        }
        if (index < drag.fromIndex && index >= drag.toIndex) {
            return drag.rowHeight;
        }
        return 0;
    };

    const getReorderErrorMessage = (error: unknown) =>
        getGraphQLErrorCode(error) === FORBIDDEN_ACTION
            ? t('admin.workspaceChannelGroups.errors.reorderForbidden')
            : t('admin.workspaceChannelGroups.errors.reorderFailed');

    const handleDragEnd = async () => {
        if (!drag) {
            return;
        }

        setDrag(null);
        if (drag.fromIndex === drag.toIndex) {
            return;
        }

        const reordered = moveItem(orderedGroups, drag.fromIndex, drag.toIndex);
        setPendingOrder({ groups: reordered, basis: channelGroups });

        try {
            // Every group gets its position, so the saved orders are always 0..n-1.
            await updateChannelGroupsOrder({
                variables: { orders: Object.fromEntries(reordered.map((channelGroup, index) => [channelGroup.id, index])) },
            });
            onChanged();
        } catch (error) {
            setPendingOrder(null);
            setReorderError(getReorderErrorMessage(error));
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
            {reorderError && (
                <div role="alert" className={styles.errorMessage}>{reorderError}</div>
            )}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead className={styles.thead}>
                        <tr>
                            <th className={`${styles.th} ${styles.dragColumn}`} />
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.order')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.group')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.channels')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.created')}</th>
                            <th className={styles.th}>{t('admin.workspaceChannelGroups.columns.actions')}</th>
                        </tr>
                    </thead>
                    <tbody ref={tbodyRef} className={`${styles.tbody} ${drag ? styles.dragging : ''}`}>
                        {orderedGroups.map((channelGroup, index) => {
                            const channelNames = getChannelNames(channelGroup);
                            const shift = getRowShift(index);

                            return (
                                <tr
                                    key={channelGroup.id}
                                    className={drag?.fromIndex === index ? styles.draggedRow : undefined}
                                    style={shift ? { transform: `translateY(${shift}px)` } : undefined}
                                >
                                    <td className={`${styles.td} ${styles.dragColumn}`}>
                                        <button
                                            type="button"
                                            className={styles.dragHandle}
                                            aria-label={t('admin.workspaceChannelGroups.dragHandle')}
                                            title={t('admin.workspaceChannelGroups.dragHandle')}
                                            disabled={reorderLoading}
                                            onPointerDown={(event) => handleDragStart(event, index)}
                                            onPointerMove={handleDragMove}
                                            onPointerUp={handleDragEnd}
                                            onPointerCancel={() => setDrag(null)}
                                        >
                                            <GripHorizontal size={16} />
                                        </button>
                                    </td>
                                    <td className={`${styles.td} ${styles.order}`}>
                                        {channelGroup.order}
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.groupName}>{channelGroup.name}</div>
                                        <div className={styles.groupId}>
                                            {t('admin.workspaceChannelGroups.id', { id: channelGroup.id })}
                                        </div>
                                    </td>
                                    <td className={`${styles.td} ${styles.channelNames}`}>
                                        {channelNames.length
                                            ? channelNames.join(', ')
                                            : <span className={styles.noChannels}>{t('admin.workspaceChannelGroups.noChannels')}</span>}
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
