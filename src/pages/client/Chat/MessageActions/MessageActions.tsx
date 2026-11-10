import { Pencil, Reply, Trash } from 'lucide-react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import styles from './MessageActions.module.css';

type Props = {
    canReply: boolean;
    canEdit: boolean;
    canDelete: boolean;
    className?: string;
    onReply(): void;
    onEdit(): void;
    onDelete(): void;
};

/** The floating panel with the reply, edit and delete actions of a message. */
export const MessageActions = ({ canReply, canEdit, canDelete, className, onReply, onEdit, onDelete }: Props) => {
    const { t } = useTranslation();
    if (!canReply && !canEdit && !canDelete) {
        return null;
    }

    return (
        <div className={clsx(styles.panel, className)}>
            {canReply && (
                <button
                    type="button"
                    className={styles.button}
                    aria-label={t('chat.message.reply')}
                    title={t('chat.message.reply')}
                    onClick={onReply}
                >
                    <Reply size={16} strokeWidth={3} aria-hidden="true" />
                </button>
            )}
            {canEdit && (
                <button
                    type="button"
                    className={styles.button}
                    aria-label={t('common.edit')}
                    title={t('common.edit')}
                    onClick={onEdit}
                >
                    <Pencil size={16} strokeWidth={3} aria-hidden="true" />
                </button>
            )}
            {canDelete && (
                <button
                    type="button"
                    className={clsx(styles.button, styles.deleteButton)}
                    aria-label={t('common.delete')}
                    title={t('common.delete')}
                    onClick={onDelete}
                >
                    <Trash size={16} strokeWidth={3} aria-hidden="true" />
                </button>
            )}
        </div>
    );
};
