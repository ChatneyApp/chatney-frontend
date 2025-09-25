import { useState } from 'react';
import { MessageInput } from './MessageInput';
import { channelListItem } from './ChatPage';

const initialMessages = [
    {
        id: 1,
        user: 'Alice',
        avatar: 'https://i.pravatar.cc/40?img=1',
        time: '10:24 AM',
        text: 'Hey, how are you doing?',
    },
    {
        id: 2,
        user: 'Bob',
        avatar: 'https://i.pravatar.cc/40?img=2',
        time: '10:26 AM',
        text: 'All good here! Working on the new layout.',
    },
];

export function MessagesList({ activeChannel, onSend }: { activeChannel: channelListItem, onSend: any }) {
    const [messages, setMessages] = useState(initialMessages);

    const handleSend = (text: string) => {
        const newMessage = {
            id: messages.length + 1,
            user: 'You',
            avatar: 'https://i.pravatar.cc/40?img=3',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            text,
        };
        onSend(newMessage)
        setMessages((prev) => [...prev, newMessage]);
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-900">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <h2 className="text-lg font-semibold mb-4"># {activeChannel.name}</h2>
                {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-4">
                        <img src={msg.avatar} alt={msg.user} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">{msg.user}</span>
                                <span className="text-xs text-gray-500">{msg.time}</span>
                            </div>
                            <p className="text-gray-200">{msg.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput onSend={handleSend} />
        </div>
    );
}
