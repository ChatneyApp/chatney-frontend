import { FormEventHandler, useEffect, useState } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { Dialog } from 'radix-ui';

import { addChannel } from '@/graphql/channels';
import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { Channel } from '@/types/channels';
import { useChannelTypesList } from '@/contexts/ChannelTypesListContext';
import { ChannelTypeId } from '@/types/channelTypes';

import styles from './CreateChannelModal.module.css';

interface CreateChannelModalProps {
    onClose: () => void;
    onChannelCreated: (channel: Channel) => void;
}

export function CreateChannelModal({ onClose, onChannelCreated }: CreateChannelModalProps) {
    const wsCtx = useWorkspacesList();
    const { channelTypes } = useChannelTypesList();
    const client = useApolloClient();
    const workspaceChannelTypes = channelTypes.filter(channelType => channelType.key !== 'dm');
    const [channelTypeId, setChannelTypeId] = useState<ChannelTypeId>(workspaceChannelTypes[0]?.id || 0);
    const [channelName, setChannelName] = useState('');

    useEffect(() => {
        const firstTypeId = workspaceChannelTypes[0]?.id;
        if (!channelTypeId && firstTypeId) {
            setChannelTypeId(firstTypeId);
        }
    }, [channelTypeId, workspaceChannelTypes]);

    const handleCreate: FormEventHandler = async (e) => {
        e.preventDefault();

        const trimmedChannelName = channelName.trim();
        if (!trimmedChannelName || !channelTypeId) {
            return;
        }

        const activeWorkspaceId = wsCtx.activeWorkspaceId;
        if (!activeWorkspaceId) {
            throw new Error('Active Workspace is not set');
        }

        try {
            const newChannel = await addChannel(client, trimmedChannelName, channelTypeId, activeWorkspaceId);
            onChannelCreated(newChannel);
            setChannelName('');
        } catch (error) {
            console.error('Error creating channel:', error);
        }
    };

    return (
        <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container}>
                    <Dialog.Title className={styles.title}>Create Channel</Dialog.Title>
                    <form className={styles.form} onSubmit={handleCreate}>
                        <label className={styles.field}>
                            <span className={styles.label}>Channel name</span>
                            <input
                                type="text"
                                value={channelName}
                                onChange={(e) => setChannelName(e.target.value)}
                                className={styles.input}
                                placeholder="Channel name"
                            />
                        </label>
                        <label className={styles.field}>
                            <span className={styles.label}>Channel type</span>
                            <select
                                value={channelTypeId}
                                onChange={(e) => setChannelTypeId(parseInt(e.target.value, 10))}
                                className={styles.select}
                            >
                                {workspaceChannelTypes.map(channelType => (
                                    <option
                                        key={channelType.id}
                                        value={channelType.id}
                                    >
                                        {channelType.name}
                                    </option>
                                ))}
                            </select>
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
                                disabled={!channelName.trim() || !channelTypeId}
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
