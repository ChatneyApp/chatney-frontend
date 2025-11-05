import { useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';

import { MessageInput } from './MessageInput';
import { ChannelListItem } from './ChatPage';
import { MessageWithUser } from '@/types/messages';
import { addReaction, deleteMessage, deleteReaction, getChannelMessagesList, postNewMessage } from '@/graphql/messages';
import {
    MessageDeletedPayload,
    ReactionChangedPayload,
    WebSocketEvent,
    WebSocketEventEmitter,
    WebSocketEventType
} from '@/communication/WebSocketEventEmitter';
import { MessageComponent } from '@/pages/client/Chat/MessageComponent';
import { useUser } from '@/contexts/UserContext.tsx';

type Props = {
    activeChannel: ChannelListItem;
    eventEmitter: WebSocketEventEmitter;
};
export function MessagesList({ activeChannel, eventEmitter }: Props) {
    const userCtx = useUser();
    const apolloClient = useApolloClient();
    const [messages, setMessages] = useState<MessageWithUser[]>([]);

    const handleSend = async (text: string) => {
        const newMessage = {
            channelId: activeChannel.id,
            content: text,
            attachments: [],
            parentId: null,
        };
        await postNewMessage(apolloClient, newMessage);
    };

    const handleOnDeleteClick = async (id: string) => {
        console.log(`delete message id = ${id}`);
        await deleteMessage(apolloClient, id);
    };

    const handleAddReaction = async (messageId: string, code: string) => {
        console.log(`add reaction id ${code}`);
        await addReaction(apolloClient, messageId, code);
    };

    const handleDeleteReaction = async (messageId: string, code: string) => {
        console.log(`delete reaction id ${code}`);
        await deleteReaction(apolloClient, messageId, code);
    };

    const handleWebSocketEvent = (event: WebSocketEvent) => {
        const { type, payload } = event;
        console.log('->> event', type, payload);
        switch (type) {
            case WebSocketEventType.NEW_MESSAGE: {
                const message = payload as MessageWithUser;
                if (message.channelId === activeChannel.id) {
                    console.log('message received!', message);
                    setMessages((prev) => [...prev, message]);
                }
            }
                break;
            case WebSocketEventType.DELETED_MESSAGE: {
                const { channelId, messageId } = payload as MessageDeletedPayload;
                console.log('should we delete message?', channelId, messageId);
                if (channelId === activeChannel.id) {
                    console.log('message deleted!', messageId);
                    setMessages((prev) => prev.filter(m => m.id !== messageId));
                }
            }
                break;
            case WebSocketEventType.NEW_REACTION:
            case WebSocketEventType.DELETED_REACTION: {
                const { messageId, channelId, code, userId } = payload as ReactionChangedPayload;
                if (channelId === activeChannel.id) {
                    const isNew = type === WebSocketEventType.NEW_REACTION;
                    setMessages(prev => prev.map(msg => {
                        if (msg.id !== messageId) {
                            return msg;
                        }

                        const newReactions = msg.reactions.map(r => ({ ...r }));
                        const codeBlock = newReactions.find(r => r.code === code);
                        if (codeBlock) {
                            codeBlock.count += isNew ? 1 : -1;
                        } else if (isNew) {
                            newReactions.push({ code, count: 1 });
                        }

                        let newMyReactions = [...msg.myReactions];
                        if (userId === userCtx?.user?.id) {
                            if (isNew) {
                                newMyReactions = [...new Set([...newMyReactions, code])];
                            } else {
                                newMyReactions = newMyReactions.filter(c => c !== code);
                            }
                        }

                        return {
                            ...msg,
                            reactions: newReactions,
                            myReactions: newMyReactions,
                        }
                    }));
                }
            }
                break;
        }
    };

    const loadMessages = async () => {
        try {
            const listRes = await getChannelMessagesList(apolloClient, activeChannel.id);
            const list = [...listRes];
            list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            setMessages(list);
        } catch (err) {
            console.log('Failed to load messages', err);
        }
    };

    useEffect(() => {
        const abortController = new AbortController();
        const { signal } = abortController;
        eventEmitter.addEventListener(WebSocketEventType.NEW_MESSAGE, handleWebSocketEvent, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_MESSAGE, handleWebSocketEvent, { signal });
        eventEmitter.addEventListener(WebSocketEventType.NEW_REACTION, handleWebSocketEvent, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_REACTION, handleWebSocketEvent, { signal });
        loadMessages();
        return () => {
            abortController.abort();
        }
    }, [activeChannel, eventEmitter]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 flex flex-col bg-gray-900">
            <div className="flex-1 flex flex-col items-start p-4 overflow-y-auto space-y-4">
                <h2 className="text-lg font-semibold mb-4"># {activeChannel?.name}</h2>
                {messages.map((message) => (
                    <MessageComponent
                        key={message.id}
                        currentUserId={userCtx?.user?.id}
                        message={message}
                        onDelete={handleOnDeleteClick}
                        onAddReaction={handleAddReaction}
                        onDeleteReaction={handleDeleteReaction}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <MessageInput onSend={handleSend} />
        </div>
    );
}
