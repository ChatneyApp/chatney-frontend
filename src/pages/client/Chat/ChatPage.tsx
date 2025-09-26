import { useState } from 'react';
import WorkspacesList from './WorkspacesList';
import { ChannelList } from './ChannelsList';
import { MessagesList } from './MessagesList';

export type channelListItem = {
    name: string,
    id: string
}

const dummyChannels: channelListItem[] = [{ id: 'ty', name: 'general' }, { id: '43', name: 'random' }, { name: 'tech', id: '1232' }, { name: 'design', id: 'qwe' }];

export function ChatPage() {
    const [activeChannel, setActiveChannel] = useState({ id: "ty", name: 'general' });
    const [channels] = useState<channelListItem[]>(dummyChannels)

    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <WorkspacesList />
            <ChannelList channels={channels} activeChannel={activeChannel} setActiveChannel={setActiveChannel} />
            <MessagesList onSend activeChannel={activeChannel} />
        </div>
    );
}
