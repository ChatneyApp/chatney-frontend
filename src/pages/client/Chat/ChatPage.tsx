import { useState } from 'react';
import WorkspacesList from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';
import { useWorkspaceChannelsList } from '@/contexts/WorkspaceChannelsListContext';

export type channelListItem = {
    name: string,
    id: string
}

export function ChatPage() {
    const wsChannelsCtx = useWorkspaceChannelsList();

    const [activeChannel, setActiveChannel] = useState(wsChannelsCtx.channels[0]);

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList />
            <ChannelList channels={wsChannelsCtx.channels} activeChannel={activeChannel} setActiveChannel={setActiveChannel} />
            <MessagesList onSend activeChannel={activeChannel} />
        </div>
    );
}
