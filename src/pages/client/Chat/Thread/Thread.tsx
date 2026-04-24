import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, PanelRightClose } from 'lucide-react';
import { useApolloClient } from '@apollo/client/react';

import { useUser } from '@/contexts/UserContext';
import { MessageInput } from '@/pages/client/Chat/MessageInput';
import { CreateMessageDto, MessageId, MessageWithUser, ReplyToMessage } from '@/types/messages';
import { AttachmentId, UploadedAttachment } from '@/types/attachments';
import { addReaction, deleteMessage, deleteReaction, getThreadMessagesList, postNewMessage, updateMessage } from '@/graphql/messages';
import {
    EditedMessagePayload,
    MessageChildrenCountUpdatedPayload,
    MessageDeletedPayload,
    ReactionChangedPayload,
    WebSocketEvent,
    WebSocketEventEmitter,
    WebSocketEventType,
    type NewMessagePayload,
} from '@/communication/WebSocketEventEmitter';
import { MessageComponent } from '@/pages/client/Chat/MessageComponent';

import styles from './Thread.module.css';

type Props = {
    rootMessage: MessageWithUser;
    eventEmitter: WebSocketEventEmitter;
    onCloseThread(): void;
}

export const Thread = ({ rootMessage, eventEmitter, onCloseThread }: Props) => {
    const userCtx = useUser();
    const apolloClient = useApolloClient();
    const [messages, setMessages] = useState<MessageWithUser[] | null>(null);
    const [refs, setRefs] = useState<Map<number, ReplyToMessage>>(new Map());
    const [isBottomVisible, setIsBottomVisible] = useState(true);
    const [replyingTo, setReplyingTo] = useState<MessageWithUser | null>(null);
    const [editingMessage, setEditingMessage] = useState<{ id: MessageId; content: string; attachments: UploadedAttachment[] } | null>(null);

    const handleReply = (message: MessageWithUser) => setReplyingTo(message);
    const handleClearReply = () => setReplyingTo(null);

    const handleEdit = (message: MessageWithUser) => {
        setEditingMessage({
            id: message.id,
            content: message.content,
            attachments: message.attachments.map(a => ({
                attachmentId: a.id,
                s3Url: `http://localhost:9000/chatney/${a.urlPath}`,
            })),
        });
    };

    const handleSaveEdit = async (id: MessageId, text: string, attachmentIds: AttachmentId[]) => {
        const ok = await updateMessage(apolloClient, { id, content: text, attachmentIds });
        if (ok) setEditingMessage(null);
    };

    const handleCancelEdit = () => setEditingMessage(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const autoScrollDone = useRef(false);

    const handleSend = async (text: string, attachmentIds: AttachmentId[]) => {
        const newMessage: CreateMessageDto = {
            channelId: rootMessage.channelId,
            content: text,
            attachmentIds,
            parentId: rootMessage.id,
            replyTo: replyingTo?.id ?? null,
        };
        await postNewMessage(apolloClient, newMessage);
        setReplyingTo(null);
    };

    const handleOnDeleteClick = async (id: MessageId) => {
        await deleteMessage(apolloClient, id);
    };

    const handleAddReaction = async (messageId: MessageId, code: string) => {
        await addReaction(apolloClient, messageId, code);
    };

    const handleDeleteReaction = async (messageId: MessageId, code: string) => {
        await deleteReaction(apolloClient, messageId, code);
    };

    const handleScrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    };

    useEffect(() => {
        const loadMessages = async () => {
            try {
                const listRes = await getThreadMessagesList(apolloClient, rootMessage.id);
                const list = [...listRes.messages];
                list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                setMessages(list);
                setRefs(new Map(listRes.refs.map(r => [r.id, r])));
            } catch (err) {
                console.error('Failed to load messages', err);
            }
        };

        const handleWebSocketEvent = (event: WebSocketEvent) => {
            const { type, payload } = event;
            switch (type) {
                case WebSocketEventType.NEW_MESSAGE: {
                    const { message, replyTo } = payload as NewMessagePayload;
                    if (message.parentId === rootMessage.id) {
                        setMessages((prev) => [...prev ?? [], message]);
                        if (replyTo) {
                            setRefs(prev => prev.has(replyTo.id) ? prev : new Map(prev).set(replyTo.id, replyTo));
                        }
                    }
                }
                    break;
                case WebSocketEventType.DELETED_MESSAGE: {
                    const { channelId, messageId } = payload as MessageDeletedPayload;
                    if (channelId === rootMessage.channelId) {
                        setMessages((prev) => prev?.filter(m => m.id !== messageId) ?? null);
                    }
                }
                    break;
                case WebSocketEventType.NEW_REACTION:
                case WebSocketEventType.DELETED_REACTION: {
                    const { messageId, channelId, code, userId } = payload as ReactionChangedPayload;
                    if (channelId === rootMessage.channelId) {
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
                case WebSocketEventType.EDITED_MESSAGE: {
                    const { message } = payload as EditedMessagePayload;
                    if (message.channelId === rootMessage.channelId) {
                        setMessages(prev => prev?.map(msg => msg.id === message.id ? { ...msg, ...message } : msg) ?? null);
                    }
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
        eventEmitter.addEventListener(WebSocketEventType.EDITED_MESSAGE, handleWebSocketEvent, { signal });
        loadMessages();
        return () => {
            abortController.abort();
        }
    }, [rootMessage, apolloClient, eventEmitter, userCtx?.user?.id]);

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
            <div className={styles.header}>
                <PanelRightClose
                    className="cursor-pointer inline-block mr-2 text-red-500"
                    onClick={onCloseThread}
                />
                Thread
            </div>
            <div className={styles.scrollArea}>
                {messages?.length ? messages.map(message => (
                    <MessageComponent
                        key={message.id}
                        currentUserId={userCtx?.user?.id}
                        message={message}
                        replyRef={message.replyTo != null ? refs.get(message.replyTo) : undefined}
                        onDelete={handleOnDeleteClick}
                        onReply={handleReply}
                        onEdit={handleEdit}
                        onAddReaction={handleAddReaction}
                        onDeleteReaction={handleDeleteReaction}
                    />
                )) : (
                    <div>No messages here yet</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {!isBottomVisible && (
                <div className={styles.scrollUpFab} onClick={handleScrollToBottom} title="Scroll to bottom">
                    <ArrowDownToLine/>
                </div>
            )}
            <MessageInput
                onSend={handleSend}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={handleCancelEdit}
                editingMessage={editingMessage}
                replyToPreview={replyingTo?.content ?? null}
                onClearReply={handleClearReply}
            />
        </div>
    );
}
