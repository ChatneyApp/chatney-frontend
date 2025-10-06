import { WorkspacesList } from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';
import { useWorkspaceChannelsList } from '@/contexts/WorkspaceChannelsListContext';
import { useWebsocket } from '@/contexts/WebSocketProvider';

export type ChannelListItem = {
    name: string,
    id: string
}

export function ChatPage() {
    const { setNewMessageReceived } = useWebsocket();
    const { channels, refetch, activeChannel, setActiveChannel } = useWorkspaceChannelsList();

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList />
            <ChannelList
                channels={channels}
                refetch={refetch}
                activeChannel={activeChannel}
                setActiveChannel={setActiveChannel}
            />
            {activeChannel && (
                <MessagesList
                    setNewMessageReceived={setNewMessageReceived}
                    activeChannel={activeChannel}
                />
            )}
        </div>
    );
}
