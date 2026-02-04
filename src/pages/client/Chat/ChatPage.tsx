import { useState } from 'react';
import { useWorkspaceChannelsList } from '@/contexts/WorkspaceChannelsListContext';
import { useWebsocket } from '@/contexts/WebSocketProvider';
import { Thread } from '@/pages/client/Chat/Thread';
import { MessageWithUser } from '@/types/messages';
import { WorkspacesList } from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';

export function ChatPage() {
    const { eventEmitter } = useWebsocket();
    const { channels, refetch, activeChannel, setActiveChannel } = useWorkspaceChannelsList();
    const [threadMessage, setThreadMessage] = useState<MessageWithUser | null>(null);

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

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList/>
            <ChannelList
                channels={channels}
                refetch={refetch}
                activeChannel={activeChannel}
                setActiveChannel={setActiveChannel}
            />
            {activeChannel && (
                <MessagesList
                    eventEmitter={eventEmitter}
                    activeChannel={activeChannel}
                    onOpenThread={handleToggleThread}
                />
            )}
            {threadMessage && (
                <Thread
                    rootMessage={threadMessage}
                    eventEmitter={eventEmitter}
                    onCloseThread={handleCloseThread}
                />
            )}
        </div>
    );
}
