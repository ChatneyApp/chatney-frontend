import { useState } from 'react';
import WorkspacesList from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';

export function ChatPage() {
    const [activeChannel, setActiveChannel] = useState({ id: "ty", name: 'general' });

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList />
            <ChannelList activeChannel={activeChannel} setActiveChannel={setActiveChannel} />
            <MessagesList activeChannel={activeChannel} />
        </div>
    );
}
