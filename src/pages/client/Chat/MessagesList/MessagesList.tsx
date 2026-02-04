import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useApolloClient } from '@apollo/client';

import { useUser } from '@/contexts/UserContext';
import { MessageInput } from '@/pages/client/Chat/MessageInput';
import { ChannelListItem } from '@/pages/client/Chat/types';
import { MessageWithUser } from '@/types/messages';
import { addReaction, deleteMessage, deleteReaction, getChannelMessagesList, postNewMessage } from '@/graphql/messages';
import {
    MessageChildrenCountUpdatedPayload,
    MessageDeletedPayload,
    ReactionChangedPayload,
    WebSocketEvent,
    WebSocketEventEmitter,
    WebSocketEventType
} from '@/communication/WebSocketEventEmitter';
import { MessageComponent } from '@/pages/client/Chat/MessageComponent';

import styles from './MessagesList.module.css';

type Props = {
    activeChannel: ChannelListItem;
    eventEmitter: WebSocketEventEmitter;
    onOpenThread(parentId: MessageWithUser): void;
};
export function MessagesList({ activeChannel, eventEmitter, onOpenThread }: Props) {
    const userCtx = useUser();
    const apolloClient = useApolloClient();
    const [messages, setMessages] = useState<MessageWithUser[] | null>(null);
    const [isBottomVisible, setIsBottomVisible] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const autoScrollDone = useRef(false);

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
        await deleteMessage(apolloClient, id);
    };

    const handleAddReaction = async (messageId: string, code: string) => {
        await addReaction(apolloClient, messageId, code);
    };

    const handleDeleteReaction = async (messageId: string, code: string) => {
        await deleteReaction(apolloClient, messageId, code);
    };

    const handleScrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    };

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const listRes = await getChannelMessagesList(apolloClient, activeChannel.id);
                const list = [...listRes];
                list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                setMessages(list);
            } catch (err) {
                console.error('Failed to load messages', err);
            }
        };

        const handleWebSocketEvent = (event: WebSocketEvent) => {
            const { type, payload } = event;
            switch (type) {
                case WebSocketEventType.NEW_MESSAGE: {
                    const message = payload as MessageWithUser;
                    if (message.channelId === activeChannel.id && !message.parentId) {
                        setMessages((prev) => [...prev ?? [], message]);
                    }
                }
                    break;
                case WebSocketEventType.DELETED_MESSAGE: {
                    const { channelId, messageId } = payload as MessageDeletedPayload;
                    if (channelId === activeChannel.id) {
                        setMessages((prev) => prev?.filter(m => m.id !== messageId) ?? null);
                    }
                }
                    break;
                case WebSocketEventType.NEW_REACTION:
                case WebSocketEventType.DELETED_REACTION: {
                    const { messageId, channelId, code, userId } = payload as ReactionChangedPayload;
                    if (channelId === activeChannel.id) {
                        const isNew = type === WebSocketEventType.NEW_REACTION;
                        setMessages(prev => prev?.map(msg => {
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
                        }) ?? null);
                    }
                }
                    break;
                case WebSocketEventType.MESSAGE_CHILDREN_COUNT_UPDATED: {
                    const { messageId, childrenCount } = payload as MessageChildrenCountUpdatedPayload;
                    setMessages(prev => prev?.map(msg => {
                        if (msg.id !== messageId) {
                            return msg;
                        }

                        return {
                            ...msg,
                            childrenCount,
                        }
                    }) ?? null);
                }
                    break;
            }
        };

        const abortController = new AbortController();
        const { signal } = abortController;
        eventEmitter.addEventListener(WebSocketEventType.NEW_MESSAGE, handleWebSocketEvent, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_MESSAGE, handleWebSocketEvent, { signal });
        eventEmitter.addEventListener(WebSocketEventType.NEW_REACTION, handleWebSocketEvent, { signal });
        eventEmitter.addEventListener(WebSocketEventType.DELETED_REACTION, handleWebSocketEvent, { signal });
        eventEmitter.addEventListener(WebSocketEventType.MESSAGE_CHILDREN_COUNT_UPDATED, handleWebSocketEvent, { signal });
        loadMessages();
        return () => {
            abortController.abort();
        }
    }, [activeChannel, apolloClient, eventEmitter, userCtx?.user?.id]);

    useEffect(() => {
        if (messages !== null && !autoScrollDone.current) {
            autoScrollDone.current = true;
            handleScrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                setIsBottomVisible(entries?.[0].isIntersecting ?? false);
            },
            {
                root: null,        // null => viewport браузера
                threshold: 0.0,    // 0.0 => достаточно хотя бы 1 пикселя
            }
        );

        observer.observe(messagesEndRef.current!);

        return () => {
            observer.disconnect();
        };
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}># {activeChannel?.name}</div>
            <div className={styles.scrollArea}>
                {messages?.map(message => (
                    <MessageComponent
                        key={message.id}
                        currentUserId={userCtx?.user?.id}
                        message={message}
                        onDelete={handleOnDeleteClick}
                        onAddReaction={handleAddReaction}
                        onDeleteReaction={handleDeleteReaction}
                        onOpenThread={onOpenThread}
                    />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {!isBottomVisible && (
                <div className={styles.scrollUpFab} onClick={handleScrollToBottom} title="Scroll to bottom">
                    <ArrowDownToLine/>
                </div>
            )}
            <MessageInput onSend={handleSend} />
        </div>
    );
}
