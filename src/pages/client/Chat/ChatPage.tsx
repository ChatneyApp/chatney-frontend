import { useState } from 'react';
import WorkspacesList from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';

export function ChatPage() {
    const [activeChannel, setActiveChannel] = useState('general');

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList />
            <ChannelList activeChannel={activeChannel} setActiveChannel={setActiveChannel} />
            <MessagesList activeChannelName={activeChannel} />
        </div>
    );
}
