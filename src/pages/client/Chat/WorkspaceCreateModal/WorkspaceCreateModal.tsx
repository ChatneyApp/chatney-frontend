import { FormEventHandler, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { Dialog } from 'radix-ui';

import { addWorkspace } from '@/graphql/workspaces';
import { Workspace } from '@/types/workspaces';

import styles from './WorkspaceCreateModal.module.css';

interface WorkspaceCreateModalProps {
    onClose: () => void;
    onWorkspaceCreated: (workspace: Workspace) => void;
}

export function WorkspaceCreateModal({ onClose, onWorkspaceCreated }: WorkspaceCreateModalProps) {
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
                    <Dialog.Title className={styles.title}>Create Workspace</Dialog.Title>
                    <form className={styles.form} onSubmit={handleCreate}>
                        <label className={styles.field}>
                            <span className={styles.label}>Workspace name</span>
                            <input
                                type="text"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className={styles.input}
                                placeholder="Workspace name"
                            />
                        </label>
                        <div className={styles.bottomButtons}>
                            <button
                                type="button"
                                onClick={onClose}
                                className={styles.cancelButton}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!workspaceName.trim()}
                                className={styles.createButton}
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
