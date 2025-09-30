import { useEffect, useState } from 'react';
import { WorkspacesList } from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';
import { useWorkspaceChannelsList } from '@/contexts/WorkspaceChannelsListContext';
import { useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { Channel } from '@/types/channels';
import { useWebsocket } from '@/contexts/WebSocketProvider';

export type ChannelListItem = {
    name: string,
    id: string
}

export function ChatPage() {
    const { workspacesList } = useWorkspacesList();
    const { setNewMessageReceived } = useWebsocket();
    const { channels } = useWorkspaceChannelsList();
    const [ activeChannel, setActiveChannel ] = useState<Channel | null>(null);


    useEffect(() => {
        if (workspacesList.length > 0 && channels.length > 0) {
            setActiveChannel(channels[0]);
        }
    }, [ workspacesList, channels ]);

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList />
            <ChannelList
                channels={channels}
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
