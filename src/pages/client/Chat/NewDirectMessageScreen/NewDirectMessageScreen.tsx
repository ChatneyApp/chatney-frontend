import { FormEventHandler, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useApolloClient } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { openDirectMessage } from '@/graphql/channels';
import { searchUsersByNickname } from '@/graphql/users';
import { Channel, DirectMessageUser } from '@/types/channels';

import styles from './NewDirectMessageScreen.module.css';

interface NewDirectMessageScreenProps {
    onCancel(): void;
    onOpened(channel: Channel): void;
}

export function NewDirectMessageScreen({ onCancel, onOpened }: NewDirectMessageScreenProps) {
    const { t } = useTranslation();
    const client = useApolloClient();
    const [prefix, setPrefix] = useState('');
    const [results, setResults] = useState<DirectMessageUser[]>([]);
    const [selected, setSelected] = useState<DirectMessageUser[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpening, setIsOpening] = useState(false);

    useEffect(() => {
        const trimmed = prefix.trim();
        if (!trimmed) {
            setResults([]);
            return;
        }

        let cancelled = false;
        const handle = window.setTimeout(async () => {
            setIsSearching(true);
            try {
                const users = await searchUsersByNickname(client, trimmed);
                if (!cancelled) {
                    setResults(users);
                }
            } catch (error) {
                console.error('Error searching users:', error);
                if (!cancelled) {
                    setResults([]);
                }
            } finally {
                if (!cancelled) {
                    setIsSearching(false);
                }
            }
        }, 250);

        return () => {
            cancelled = true;
            window.clearTimeout(handle);
        };
    }, [client, prefix]);

    const toggleUser = (user: DirectMessageUser) => {
        setSelected(current => {
            if (current.some(selectedUser => selectedUser.id === user.id)) {
                return current.filter(selectedUser => selectedUser.id !== user.id);
            }

            return [...current, user];
        });
    };

    const handleOpen = async (userIds: string[]) => {
        if (userIds.length === 0 || isOpening) {
            return;
        }

        setIsOpening(true);
        try {
            const channel = await openDirectMessage(client, userIds);
            onOpened(channel);
        } catch (error) {
            console.error('Error opening direct message:', error);
        } finally {
            setIsOpening(false);
        }
    };

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        if (selected.length > 0) {
            void handleOpen(selected.map(user => user.id));
            return;
        }

        if (results[0]) {
            void handleOpen([results[0].id]);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>{t('chat.newDirectMessage.title')}</div>
            <div className={styles.body}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label className={styles.field}>
                        <span className={styles.label}>{t('chat.newDirectMessage.nickname')}</span>
                        <input
                            type="text"
                            value={prefix}
                            onChange={(event) => setPrefix(event.target.value)}
                            className={styles.input}
                            placeholder={t('chat.newDirectMessage.searchPlaceholder')}
                            autoFocus
                        />
                    </label>
                    {selected.length > 0 && (
                        <div className={styles.field}>
                            <span className={styles.label}>{t('chat.newDirectMessage.to')}</span>
                            <div className={styles.selectedList}>
                                {selected.map(user => (
                                    <button
                                        key={user.id}
                                        type="button"
                                        className={styles.selectedChip}
                                        onClick={() => toggleUser(user)}
                                    >
                                        {user.nickname} ×
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className={styles.field}>
                        {isSearching && <span className={styles.label}>{t('chat.newDirectMessage.searching')}</span>}
                        {!isSearching && prefix.trim() && results.length === 0 && (
                            <span className={styles.label}>{t('chat.newDirectMessage.noUsers')}</span>
                        )}
                        <div className={styles.results}>
                            {results.map((user) => {
                                const isSelected = selected.some(selectedUser => selectedUser.id === user.id);
                                return (
                                    <button
                                        key={user.id}
                                        type="button"
                                        className={clsx(styles.resultButton, {
                                            [styles.resultButtonSelected]: isSelected,
                                        })}
                                        onClick={() => toggleUser(user)}
                                    >
                                        {isSelected ? `✓ ${user.nickname}` : user.nickname}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <div className={styles.bottomButtons}>
                        <button
                            type="button"
                            onClick={onCancel}
                            className={styles.cancelButton}
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={selected.length === 0 || isOpening}
                            className={styles.openButton}
                        >
                            {t('chat.newDirectMessage.open')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
