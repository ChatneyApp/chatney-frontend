import { useState } from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { Channel, channelDisplayName } from '@/types/channels';
import { ChannelGroup } from '@/types/channelGroups';
import { GroupedChannels } from '@/helpers/channelGroups';
import { CreateChannelModal } from '../CreateChannelModal';

import styles from './ChannelsList.module.css';

type Props = {
    activeChannel: Channel | null;
    isComposingDirectMessage: boolean;
    setActiveChannel(channel: Channel): void;
    onComposeDirectMessage(): void;
    groupedChannels: GroupedChannels<ChannelGroup, Channel>;
    directMessages: Channel[];
};

export function ChannelList({
    activeChannel,
    isComposingDirectMessage,
    setActiveChannel,
    onComposeDirectMessage,
    groupedChannels,
    directMessages,
}: Props) {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { activeWorkspaceId, workspacesList } = useWorkspacesList();
    const activeWorkspace = workspacesList.find(workspace => workspace.id === activeWorkspaceId);

    const handleChannelCreated = (newChannel: Channel) => {
        setIsModalOpen(false);
        setActiveChannel(newChannel);
    };

    const renderChannel = (channel: Channel) => (
        <div
            key={channel.id}
            onClick={() => setActiveChannel(channel)}
            className={clsx(styles.channelItem, {
                [styles.channelItemActive]: activeChannel?.id === channel.id,
            })}
        >
            {channelDisplayName(channel)}
        </div>
    );

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
                + {t('chat.channels.createChannel')}
            </div>

            {groupedChannels.groups.map(({ group, channels: sectionChannels }) => (
                <div key={group.id} className={styles.group}>
                    <div title={group.name} className={styles.groupTitle}>{group.name}</div>
                    {sectionChannels.map(renderChannel)}
                </div>
            ))}

            {groupedChannels.ungrouped.map(renderChannel)}

            <div className={styles.sectionTitle}>{t('chat.channels.directMessages')}</div>
            <div
                className={clsx(styles.createChannelButton, {
                    [styles.channelItemActive]: isComposingDirectMessage,
                })}
                onClick={onComposeDirectMessage}
            >
                + {t('chat.channels.newMessage')}
            </div>

            {directMessages.map(renderChannel)}

            {isModalOpen && (
                <CreateChannelModal
                    onClose={() => setIsModalOpen(false)}
                    onChannelCreated={handleChannelCreated}
                />
            )}
        </div>
    );
}
