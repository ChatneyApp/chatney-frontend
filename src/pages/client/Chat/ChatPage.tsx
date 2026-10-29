import { useEffect, useMemo, useState } from 'react';
import { useMatch, useNavigate } from 'react-router';
import { useWorkspaceChannelsList } from '@/contexts/WorkspaceChannelsListContext';
import { useWorkspaceChannelGroupsList } from '@/contexts/WorkspaceChannelGroupsListContext';
import { useDirectMessagesList } from '@/contexts/DirectMessagesListContext';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { Channel, channelDisplayName } from '@/types/channels';
import { getFirstChannel, groupChannels } from '@/helpers/channelGroups';
import { Thread } from '@/pages/client/Chat/Thread';
import { MessageWithUser } from '@/types/messages';
import { WorkspacesList } from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';
import { NewDirectMessageScreen } from './NewDirectMessageScreen';

const chatPageUrl = '/client/chat';
const newDirectMessageUrl = '/client/chat/new';

export function ChatPage() {
    const navigate = useNavigate();
    const isComposingDirectMessage = Boolean(useMatch('/client/chat/new'));
    const { eventEmitter } = useWebsocket();
    const { channels, loaded: channelsLoaded } = useWorkspaceChannelsList();
    const { channelGroups, loaded: channelGroupsLoaded } = useWorkspaceChannelGroupsList();
    const groupedChannels = useMemo(() => groupChannels(channels, channelGroups), [channels, channelGroups]);
    const { directMessages, refetch: refetchDirectMessages } = useDirectMessagesList();
    const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
    const [threadMessage, setThreadMessage] = useState<MessageWithUser | null>(null);

    useEffect(() => {
        if (activeChannel) {
            const stillExists = channels.some(channel => channel.id === activeChannel.id)
                || directMessages.some(channel => channel.id === activeChannel.id);
            if (stillExists) {
                const updated = channels.find(channel => channel.id === activeChannel.id)
                    ?? directMessages.find(channel => channel.id === activeChannel.id);
                if (updated && updated !== activeChannel) {
                    setActiveChannel(updated);
                }
                return;
            }
        }

        // Wait for the channels and their groups: together they decide which channel is rendered first.
        if (!channelsLoaded || !channelGroupsLoaded) {
            return;
        }

        const firstChannel = getFirstChannel(groupedChannels);
        if (firstChannel) {
            setActiveChannel(firstChannel);
        } else if (directMessages[0]) {
            setActiveChannel(directMessages[0]);
        } else {
            setActiveChannel(null);
        }
    }, [channels, directMessages, activeChannel, groupedChannels, channelsLoaded, channelGroupsLoaded]);

    const handleToggleThread = (value: MessageWithUser) => {
        if (threadMessage?.id === value.id) {
            setThreadMessage(null);
        } else {
            setThreadMessage(value);
        }
    };

    const handleCloseThread = () => {
        setThreadMessage(null);
    };

    const handleSelectChannel = (channel: Channel) => {
        setThreadMessage(null);
        setActiveChannel(channel);
        if (isComposingDirectMessage) {
            navigate(chatPageUrl);
        }
    };

    const handleComposeDirectMessage = () => {
        setThreadMessage(null);
        navigate(newDirectMessageUrl);
    };

    const handleDirectMessageOpened = async (channel: Channel) => {
        await refetchDirectMessages();
        setActiveChannel(channel);
        navigate(chatPageUrl);
    };

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList/>
            <ChannelList
                groupedChannels={groupedChannels}
                directMessages={directMessages}
                activeChannel={isComposingDirectMessage ? null : activeChannel}
                isComposingDirectMessage={isComposingDirectMessage}
                setActiveChannel={handleSelectChannel}
                onComposeDirectMessage={handleComposeDirectMessage}
            />
            {isComposingDirectMessage ? (
                <NewDirectMessageScreen
                    onCancel={() => navigate(chatPageUrl)}
                    onOpened={handleDirectMessageOpened}
                />
            ) : activeChannel && (
                <MessagesList
                    eventEmitter={eventEmitter}
                    activeChannel={{
                        id: activeChannel.id,
                        name: channelDisplayName(activeChannel),
                        isDm: activeChannel.isDm,
                    }}
                    activeThreadId={threadMessage?.id}
                    onCloseThread={handleCloseThread}
                    onOpenThread={handleToggleThread}
                />
            )}
            {threadMessage && !isComposingDirectMessage && (
                <Thread
                    rootMessage={threadMessage}
                    isDm={activeChannel?.isDm ?? false}
                    eventEmitter={eventEmitter}
                    onCloseThread={handleCloseThread}
                />
            )}
        </div>
    );
}
