import { useState } from 'react';
import WorkspacesList from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';
import { useWorkspaceChannelsList } from '@/contexts/WorkspaceChannelsListContext';

export type ChannelListItem = {
    name: string,
    id: string
}

export function ChatPage() {
    const wsChannelsCtx = useWorkspaceChannelsList();

    const [ activeChannel, setActiveChannel ] = useState(wsChannelsCtx.channels[0]);

    const handleSend = () => {
        // TODO: implement send message
    };

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList />
            <ChannelList channels={wsChannelsCtx.channels} activeChannel={activeChannel} setActiveChannel={setActiveChannel} />
            <MessagesList onSend={handleSend} activeChannel={activeChannel} />
        </div>
    );
}
