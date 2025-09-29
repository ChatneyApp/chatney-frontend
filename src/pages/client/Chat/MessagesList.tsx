import { useEffect, useState } from 'react';
import { MessageInput } from './MessageInput';
import { ChannelListItem } from './ChatPage';
import { Message } from '@/types/messages';
import { getChannelMessagesList, postNewMessage } from '@/graphql/messages';
import { useApolloClient } from '@apollo/client';

type Props = {
    activeChannel: ChannelListItem;
};
export function MessagesList({ activeChannel }: Props) {
    const apolloClient = useApolloClient();
    const [ messages, setMessages ] = useState<Message[]>([]);

    const handleSend = async (text: string) => {
        const newMessage = {
            channelId: activeChannel.id,
            content: text,
            attachments: [],
            parentId: null,
        };
        const mRes = await postNewMessage(apolloClient, newMessage);
        setMessages((prev) => [ ...prev, mRes ]);
    };

    const loadMessages = async () => {
        try {
            const listRes = await getChannelMessagesList(apolloClient, activeChannel.id);
            const list = [ ...listRes ];
            list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setMessages(list);
        } catch (err) {
            console.log('Failed to load messages', err);
            /* swallow */
        }
    };

    useEffect(() => {
        loadMessages();
    }, [ activeChannel ]);

    console.log('messages', messages, messages.map(m => new Date(m.createdAt).getTime()));

    return (
        <div className="flex-1 flex flex-col bg-gray-900">
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                <h2 className="text-lg font-semibold mb-4"># {activeChannel?.name}</h2>
                {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start space-x-4">
                        <img src="https://i.pravatar.cc/40?img=1" alt={msg.userId} className="w-10 h-10 rounded-full" />
                        <div>
                            <div className="flex items-center space-x-2">
                                <span className="font-medium">{msg.userId}</span>
                                <span className="text-xs text-gray-500">{new Date(msg.createdAt).toISOString()}</span>
                            </div>
                            <p className="text-gray-200">{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <MessageInput onSend={handleSend} />
        </div>
    );
}
