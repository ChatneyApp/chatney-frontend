import { FormEventHandler, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { addWorkspace } from '@/graphql/workspaces';
import { Workspace } from '@/types/workspaces';

import styles from './WorkspaceCreateModal.module.css';

interface WorkspaceCreateModalProps {
    onClose: () => void;
    onWorkspaceCreated: (workspace: Workspace) => void;
}

export function WorkspaceCreateModal({ onClose, onWorkspaceCreated }: WorkspaceCreateModalProps) {
    const { t } = useTranslation();
    const [workspaceName, setWorkspaceName] = useState('');
    const client = useApolloClient();

    const handleCreate: FormEventHandler = async (e) => {
        e.preventDefault();

        const trimmedWorkspaceName = workspaceName.trim();
        if (!trimmedWorkspaceName) {
            return;
        }

        try {
            const newWorkspace = await addWorkspace(client, trimmedWorkspaceName);
            onWorkspaceCreated(newWorkspace);
            setWorkspaceName('');
        } catch (error) {
            console.error('Error creating workspace:', error);
        }
    };

    return (
        <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container}>
                    <Dialog.Title className={styles.title}>{t('chat.createWorkspace.title')}</Dialog.Title>
                    <form className={styles.form} onSubmit={handleCreate}>
                        <label className={styles.field}>
                            <span className={styles.label}>{t('chat.createWorkspace.name')}</span>
                            <input
                                type="text"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className={styles.input}
                                placeholder={t('chat.createWorkspace.name')}
                            />
                        </label>
                        <div className={styles.bottomButtons}>
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.cancelButton}
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={!workspaceName.trim()}
                                className={styles.createButton}
                            >
                                {t('common.create')}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
