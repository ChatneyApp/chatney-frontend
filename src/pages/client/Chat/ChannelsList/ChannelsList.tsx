import { useState } from 'react';
import clsx from 'clsx';

import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { Channel, ChannelId } from '@/types/channels';
import { CreateChannelModal } from '../CreateChannelModal';
import { ChannelListItem } from '../types';

import styles from './ChannelsList.module.css';

type Props = {
    activeChannel: Channel | null;
    setActiveChannel(channel: Channel): void;
    channels: Channel[];
    refetch: (channelId?: ChannelId) => void;
};
export function ChannelList({ activeChannel, setActiveChannel, channels, refetch }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { activeWorkspaceId, workspacesList } = useWorkspacesList();
    const activeWorkspace = workspacesList.find(workspace => workspace.id === activeWorkspaceId);

    const handleChannelCreated = (newChannel: ChannelListItem) => {
        setIsModalOpen(false);
        refetch(newChannel.id);
    };

    return (
        <div className={styles.container}>
            <div
                title={activeWorkspace?.name}
                className={styles.workspaceTitle}
            >
                {activeWorkspace?.name}
            </div>
            <div
                className={styles.createChannelButton}
                onClick={() => setIsModalOpen(true)}
            >
                + Create channel
            </div>

            {channels.map((channel) => (
                <div
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={clsx(styles.channelItem, {
                        [styles.channelItemActive]: activeChannel?.id === channel.id,
                    })}
                >
                    {channel.name}
                </div>
            ))}

            {isModalOpen && (
                <CreateChannelModal
                    onClose={() => setIsModalOpen(false)}
                    onChannelCreated={handleChannelCreated}
                />
            )}
        </div>
    );
}
