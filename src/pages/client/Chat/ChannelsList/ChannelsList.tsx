import { useState } from 'react';
import clsx from 'clsx';

import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { Channel, ChannelId, channelDisplayName } from '@/types/channels';
import { CreateChannelModal } from '../CreateChannelModal';

import styles from './ChannelsList.module.css';

type Props = {
    activeChannel: Channel | null;
    isComposingDirectMessage: boolean;
    setActiveChannel(channel: Channel): void;
    onComposeDirectMessage(): void;
    channels: Channel[];
    directMessages: Channel[];
    refetchChannels: (channelId?: ChannelId) => void;
};

export function ChannelList({
    activeChannel,
    isComposingDirectMessage,
    setActiveChannel,
    onComposeDirectMessage,
    channels,
    directMessages,
    refetchChannels,
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { activeWorkspaceId, workspacesList } = useWorkspacesList();
    const activeWorkspace = workspacesList.find(workspace => workspace.id === activeWorkspaceId);

    const handleChannelCreated = (newChannel: Channel) => {
        setIsModalOpen(false);
        refetchChannels(newChannel.id);
        setActiveChannel(newChannel);
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
                    {channelDisplayName(channel)}
                </div>
            ))}

            <div className={styles.sectionTitle}>Direct messages</div>
            <div
                className={clsx(styles.createChannelButton, {
                    [styles.channelItemActive]: isComposingDirectMessage,
                })}
                onClick={onComposeDirectMessage}
            >
                + New message
            </div>

            {directMessages.map((channel) => (
                <div
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={clsx(styles.channelItem, {
                        [styles.channelItemActive]: activeChannel?.id === channel.id,
                    })}
                >
                    {channelDisplayName(channel)}
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
