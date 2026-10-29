import { AlertDialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import styles from './ConfirmDialog.module.css';

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    loading?: boolean;
    error?: string | null;
};

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    loading = false,
    error,
}: Props) {
    const { t } = useTranslation();

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className={styles.overlay} />
                <AlertDialog.Content className={styles.container}>
                    <AlertDialog.Title className={styles.title}>{title}</AlertDialog.Title>
                    <AlertDialog.Description className={styles.description}>
                        {description}
                    </AlertDialog.Description>

                    {error && (
                        <div role="alert" className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <div className={styles.bottomButtons}>
                        <AlertDialog.Cancel asChild>
                            <button type="button" className={styles.cancelButton}>
                                {t('common.cancel')}
                            </button>
                        </AlertDialog.Cancel>
                        {/* Not AlertDialog.Action: it closes the dialog on click, but the dialog must stay open to show an error. */}
                        <button
                            type="button"
                            className={styles.confirmButton}
                            onClick={onConfirm}
                            disabled={loading}
                        >
                            {t('common.ok')}
                        </button>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
}
