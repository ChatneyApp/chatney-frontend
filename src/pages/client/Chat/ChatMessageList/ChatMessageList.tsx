import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDownToLine } from 'lucide-react';
import { useApolloClient } from '@apollo/client/react';

import { WebSocketEvent, WebSocketEventEmitter, WebSocketEventType } from '@/communication/WebSocketEventEmitter';
import {
    EditedMessagePayload,
    MessageChildrenCountUpdatedPayload,
    MessageDeletedPayload,
    NewMessagePayload,
    ReactionChangedPayload,
} from '@/communication/WebSocketEventEmitter';
import { useUser } from '@/contexts/UserContext';
import { addReaction, deleteMessage, deleteReaction, postNewMessage, updateMessage } from '@/graphql/messages';
import { MessageComponent } from '@/pages/client/Chat/MessageComponent';
import { MessageInput } from '@/pages/client/Chat/MessageInput';
import { Attachment, AttachmentId } from '@/types/attachments';
import { ChannelId } from '@/types/channels';
import { CreateMessageDto, MessageId, MessagesResult, MessageWithUser, ReplyToMessage } from '@/types/messages';

type ClassNames = {
    container: string;
    header: string;
    scrollArea: string;
    scrollUpFab: string;
};

type Props = {
    channelId: ChannelId;
    parentId: MessageId | null;
    header: ReactNode;
    classNames: ClassNames;
    eventEmitter: WebSocketEventEmitter;
    loadMessages(): Promise<MessagesResult>;
    isMessageInContext(message: MessageWithUser): boolean;
    emptyState?: ReactNode;
    onOpenThread?(parentId: MessageWithUser): void;
    onMessageDeleted?(messageId: MessageId): void;
};

const subscribedEvents = [
    WebSocketEventType.NEW_MESSAGE,
    WebSocketEventType.DELETED_MESSAGE,
    WebSocketEventType.NEW_REACTION,
    WebSocketEventType.DELETED_REACTION,
    WebSocketEventType.MESSAGE_CHILDREN_COUNT_UPDATED,
    WebSocketEventType.EDITED_MESSAGE,
];

export const ChatMessageList = ({
    channelId,
    parentId,
    header,
    classNames,
    eventEmitter,
    loadMessages,
    isMessageInContext,
    emptyState,
    onOpenThread,
    onMessageDeleted,
}: Props) => {
    const userCtx = useUser();
    const apolloClient = useApolloClient();
    const [messages, setMessages] = useState<MessageWithUser[] | null>(null);
    const [refs, setRefs] = useState<Map<number, ReplyToMessage>>(new Map());
    const [isBottomVisible, setIsBottomVisible] = useState(true);
    const [replyingTo, setReplyingTo] = useState<MessageWithUser | null>(null);
    const [editingMessage, setEditingMessage] = useState<{ id: MessageId; content: string; attachments: Attachment[] } | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const autoScrollDone = useRef(false);
    const isBottomVisibleRef = useRef(true);
    const shouldScrollAfterMessagesUpdate = useRef(false);

    const handleSend = async (text: string, attachmentIds: AttachmentId[]) => {
        const newMessage: CreateMessageDto = {
            channelId,
            content: text,
            attachmentIds,
            parentId,
            replyTo: replyingTo?.id ?? null,
        };
        await postNewMessage(apolloClient, newMessage);
        setReplyingTo(null);
    };

    const handleReply = (message: MessageWithUser) => {
        setReplyingTo(message);
    };

    const handleClearReply = () => {
        setReplyingTo(null);
    };

    const handleEdit = (message: MessageWithUser | null) => {
        if (!message) {
            setEditingMessage(null);
            return;
        }

        setEditingMessage({
            id: message.id,
            content: message.content,
            attachments: message.attachments,
        });
    };

    const handleSaveEdit = async (id: MessageId, text: string, attachmentIds: AttachmentId[]) => {
        const ok = await updateMessage(apolloClient, { id, content: text, attachmentIds });
        if (ok) {
            setEditingMessage(null);
        }
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

    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
        const scrollArea = scrollAreaRef.current;
        if (!scrollArea) {
            return;
        }

        scrollArea.scrollTo({
            top: scrollArea.scrollHeight,
            behavior,
        });
    }, []);

    const handleScrollToBottom = useCallback(() => {
        scrollToBottom('smooth');
    }, [scrollToBottom]);

    useEffect(() => {
        const handleWebSocketEvent = (event: WebSocketEvent) => {
            const { type, payload } = event;
            switch (type) {
                case WebSocketEventType.NEW_MESSAGE: {
                    const { message, replyTo } = payload as NewMessagePayload;
                    if (isMessageInContext(message)) {
                        shouldScrollAfterMessagesUpdate.current = isBottomVisibleRef.current;
                        setMessages((prev) => [...prev ?? [], message]);
                        if (replyTo) {
                            setRefs(prev => prev.has(replyTo.id) ? prev : new Map(prev).set(replyTo.id, replyTo));
                        }
                    }
                }
                    break;
                case WebSocketEventType.DELETED_MESSAGE: {
                    const { channelId: deletedFromChannelId, messageId } = payload as MessageDeletedPayload;
                    if (deletedFromChannelId === channelId) {
                        setMessages((prev) => prev?.filter(m => m.id !== messageId) ?? null);
                        onMessageDeleted?.(messageId);
                    }
                }
                    break;
                case WebSocketEventType.NEW_REACTION:
                case WebSocketEventType.DELETED_REACTION: {
                    const { messageId, channelId: reactionChannelId, code, userId } = payload as ReactionChangedPayload;
                    if (reactionChannelId === channelId) {
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
                            };
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
                        };
                    }) ?? null);
                }
                    break;
                case WebSocketEventType.EDITED_MESSAGE: {
                    const { message } = payload as EditedMessagePayload;
                    if (message.channelId === channelId) {
                        setMessages(prev => prev?.map(msg => msg.id === message.id ? { ...msg, ...message } : msg) ?? null);
                    }
                }
                    break;
            }
        };

        const load = async () => {
            try {
                autoScrollDone.current = false;
                setMessages(null);
                setRefs(new Map());
                const listRes = await loadMessages();
                const list = [...listRes.messages];
                list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                setMessages(list);
                setRefs(new Map(listRes.refs.map(r => [r.id, r])));
            } catch (err) {
                console.error('Failed to load messages', err);
            }
        };

        const abortController = new AbortController();
        const { signal } = abortController;
        subscribedEvents.forEach(eventType => {
            eventEmitter.addEventListener(eventType, handleWebSocketEvent, { signal });
        });
        load();

        return () => {
            abortController.abort();
        };
    }, [apolloClient, channelId, eventEmitter, isMessageInContext, loadMessages, onMessageDeleted, userCtx?.user?.id]);

    useLayoutEffect(() => {
        if (messages !== null && !autoScrollDone.current) {
            autoScrollDone.current = true;
            scrollToBottom();
            return;
        }

        if (shouldScrollAfterMessagesUpdate.current) {
            shouldScrollAfterMessagesUpdate.current = false;
            scrollToBottom('smooth');
        }
    }, [messages, scrollToBottom]);

    useEffect(() => {
        const scrollArea = scrollAreaRef.current;
        const target = messagesEndRef.current;
        if (!scrollArea || !target) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const isVisible = entries?.[0].isIntersecting ?? false;
                isBottomVisibleRef.current = isVisible;
                setIsBottomVisible(isVisible);
            },
            {
                root: scrollArea,
                threshold: 0.0,
            }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    });

    return (
        <div className={classNames.container}>
            <div className={classNames.header}>{header}</div>
            <div className={classNames.scrollArea} ref={scrollAreaRef}>
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
                        onOpenThread={onOpenThread}
                    />
                )) : emptyState}
                <div ref={messagesEndRef} />
            </div>

            {!isBottomVisible && (
                <div className={classNames.scrollUpFab} onClick={handleScrollToBottom} title="Scroll to bottom">
                    <ArrowDownToLine/>
                </div>
            )}
            <MessageInput
                onSend={handleSend}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => setEditingMessage(null)}
                editingMessage={editingMessage}
                replyToPreview={replyingTo?.content ?? null}
                onClearReply={handleClearReply}
            />
        </div>
    );
};
