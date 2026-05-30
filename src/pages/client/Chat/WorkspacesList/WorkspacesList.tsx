import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

import { useUser } from '@/contexts/UserContext';
import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { Workspace } from '@/types/workspaces';
import { WorkspaceCreateModal } from '../WorkspaceCreateModal';

import styles from './WorkspacesList.module.css';

export function WorkspacesList() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const workspacesList = useWorkspacesList();
    const userCtx = useUser();
    const [showPopup, setShowPopup] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLDivElement>(null);

    const handleWorkspaceCreated = (newWs: Workspace) => {
        workspacesList.setWorkspacesList([...workspacesList.workspacesList, newWs]);
        workspacesList.setActiveWorkspaceId(newWs.id);
        setIsModalOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if ((popupRef.current && !popupRef.current.contains(event.target as Node)) &&
            (avatarRef.current && !avatarRef.current.contains(event.target as Node))) {
            setShowPopup(false);
        }
    };

    useEffect(() => {
        if (showPopup) {
            document.addEventListener('mouseup', handleClickOutside);
        } else {
            document.removeEventListener('mouseup', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mouseup', handleClickOutside);
        };
    }, [showPopup]);

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

            <div className={styles.profileArea}>
                {showPopup && (
                    <div
                        ref={popupRef}
                        className={styles.profilePopup}
                    >
                        <div className={styles.profilePopupChevron} />

                        <div className={styles.profileInfo}>
                            <div className={styles.profileName}>{userCtx?.user?.name}</div>
                            <div className={styles.profileRole}>Role</div>
                        </div>

                        <ul className={styles.profileLinks}>
                            <li>
                                <a href="/dashboard" className={styles.profileLink}>
                                    Dashboard
                                </a>
                            </li>
                            <li>
                                <a href="/settings" className={styles.profileLink}>
                                    Settings
                                </a>
                            </li>
                            <li>
                                <a href="/profile" className={styles.profileLink}>
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a href="/help" className={styles.profileLink}>
                                    Help & Support
                                </a>
                            </li>
                            <br />
                            <li>
                                <a onClick={() => userCtx?.logout()} className={styles.logoutLink}>
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                )}

                <div
                    ref={avatarRef}
                    className={styles.avatar}
                    title="Your Profile"
                    onClick={() => setShowPopup(!showPopup)}
                >
                    {userCtx?.user?.name[0].toUpperCase()}
                </div>
            </div>
        </div>
    );
}
