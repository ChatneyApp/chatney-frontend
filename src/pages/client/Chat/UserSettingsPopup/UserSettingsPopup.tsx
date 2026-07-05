import { useEffect, useRef, useState } from 'react';

import { useUser } from '@/contexts/UserContext';
import { getUserAvatarInitial, getUserDisplayName } from '@/helpers/nickname';

import styles from './UserSettingsPopup.module.css';

export function UserSettingsPopup() {
    const userCtx = useUser();
    const [showPopup, setShowPopup] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

    const user = userCtx?.user;
    const displayName = user ? getUserDisplayName(user) : '';

    return (
        <div className={styles.profileArea} ref={containerRef}>
            {showPopup && user && (
                <div className={styles.profilePopup}>
                    <div className={styles.profilePopupChevron} />

                    <div className={styles.profileInfo}>
                        <div className={styles.profileName}>{displayName}</div>
                        <div className={styles.profileRole}>@{user.nickname}</div>
                        <div className={styles.profileRole}>{user.email}</div>
                    </div>

                    <ul className={styles.profileLinks}>
                        <li>
                            <a href="/admin/roles" className={styles.profileLink}>
                                Admin
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
                className={styles.avatar}
                title="Your Profile"
                onClick={() => setShowPopup(!showPopup)}
            >
                {user ? getUserAvatarInitial(user) : '?'}
            </div>
        </div>
    );
}
