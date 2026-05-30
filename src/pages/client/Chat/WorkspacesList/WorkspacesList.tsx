import { useState } from 'react';
import clsx from 'clsx';

import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { Workspace } from '@/types/workspaces';
import { WorkspaceCreateModal } from '../WorkspaceCreateModal';
import { UserSettingsPopup } from '../UserSettingsPopup';

import styles from './WorkspacesList.module.css';

export function WorkspacesList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const workspacesList = useWorkspacesList();

    const handleWorkspaceCreated = (newWs: Workspace) => {
        workspacesList.setWorkspacesList([...workspacesList.workspacesList, newWs]);
        workspacesList.setActiveWorkspaceId(newWs.id);
        setIsModalOpen(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.workspaceItems}>
                {workspacesList.workspacesList.map((ws, idx) => {
                    const isActive = workspacesList.activeWorkspaceId === ws.id;

                    return (
                        <div
                            title={ws.name}
                            key={idx}
                            onClick={() => workspacesList.setActiveWorkspaceId(ws.id)}
                            className={clsx(styles.workspaceButton, { [styles.workspaceButtonActive]: isActive })}
                        >
                            <span className={clsx({ [styles.workspaceInitialActive]: isActive })}>
                                {ws.name[0].toUpperCase()}
                            </span>
                        </div>
                    );
                })}
                <div
                    onClick={() => setIsModalOpen(true)}
                    title="Create workspace"
                    className={styles.createWorkspaceButton}
                >
                    +
                </div>
                {isModalOpen && (
                    <WorkspaceCreateModal
                        onClose={() => setIsModalOpen(false)}
                        onWorkspaceCreated={handleWorkspaceCreated}
                    />
                )}
            </div>

            <UserSettingsPopup />
        </div>
    );
}
