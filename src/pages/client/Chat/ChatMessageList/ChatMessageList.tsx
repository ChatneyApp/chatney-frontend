import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowDownToLine, LoaderCircle } from 'lucide-react';
import { useApolloClient } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { WebSocketEventEmitter, WebSocketEventOf } from '@/communication/WebSocketEventEmitter';
import { useUser } from '@/contexts/UserContext';
import { useChannelPermissions } from '@/contexts/MyPermissionsContext';
import { markAvatarChanged } from '@/helpers/avatar';
import { canDeleteMessage, canEditMessage } from '@/helpers/channelPermissions';
import { messagesChunkSize, messagesInitialCount } from '@/infra/consts';
import { addReaction, deleteMessage, deleteReaction, postNewMessage, updateMessage } from '@/graphql/messages';
import { MessageComponent } from '@/pages/client/Chat/MessageComponent';
import { MessageInput } from '@/pages/client/Chat/MessageInput';
import { Attachment, AttachmentId } from '@/types/attachments';
import { ChannelId } from '@/types/channels';
import { CreateMessageDto, MessageId, MessagesResult, MessageWithUser, ReplyToMessage } from '@/types/messages';

import styles from './ChatMessageList.module.css';

type ClassNames = {
    container: string;
    header: string;
    scrollArea: string;
    scrollUpFab: string;
};

type Props = {
    channelId: ChannelId;
    isDm: boolean;
    parentId: MessageId | null;
    header: ReactNode;
    classNames: ClassNames;
    eventEmitter: WebSocketEventEmitter;
    /** Loads `limit` newest messages, or the ones older than `beforeId` when it is given. */
    loadMessages(limit: number, beforeId?: MessageId): Promise<MessagesResult>;
    isMessageInContext(message: MessageWithUser): boolean;
    emptyState?: ReactNode;
    onOpenThread?(parentId: MessageWithUser): void;
    onMessageDeleted?(messageId: MessageId): void;
};

const subscribedEvents = [
    'newMessage',
    'deletedMessage',
    'newReaction',
    'deletedReaction',
    'messageChildrenCountUpdated',
    'editedMessage',
    'updatedUserProfile',
] as const;

const sortByCreatedAt = (list: readonly MessageWithUser[]) =>
    [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

export const ChatMessageList = ({
    channelId,
    isDm,
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
    const { t } = useTranslation();
    const userCtx = useUser();
    const apolloClient = useApolloClient();
    const permissions = useChannelPermissions(channelId, isDm);
    const [messages, setMessages] = useState<MessageWithUser[] | null>(null);
    const [refs, setRefs] = useState<Map<number, ReplyToMessage>>(new Map());
    const [isBottomVisible, setIsBottomVisible] = useState(true);
    const [isLoadingOlder, setIsLoadingOlder] = useState(false);
    const [hasReachedStart, setHasReachedStart] = useState(false);
    const [hasOlderLoadFailed, setHasOlderLoadFailed] = useState(false);
    const [replyingTo, setReplyingTo] = useState<MessageWithUser | null>(null);
    const [editingMessage, setEditingMessage] = useState<{ id: MessageId; content: string; attachments: Attachment[] } | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement | null>(null);
    const messageInputRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesStartRef = useRef<HTMLDivElement | null>(null);
    // aborted when the list switches to another channel or thread
    const listSignalRef = useRef<AbortSignal | null>(null);
    // distance from the bottom before the top of the list changes, to keep the viewport in place
    const bottomOffsetToRestore = useRef<number | null>(null);
    const autoScrollDone = useRef(false);
    const isBottomVisibleRef = useRef(true);
    const shouldScrollAfterMessagesUpdate = useRef(false);
    // posting inside a thread also requires the thread permission
    const canPostHere = permissions.canPost && (parentId === null || permissions.canCreateThread);
    // the permissions can be revoked mid-edit or mid-reply
    const activeEditingMessage = permissions.canEditOwn ? editingMessage : null;
    const activeReplyingTo = canPostHere ? replyingTo : null;

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
        const handleWebSocketEvent = (event: WebSocketEventOf<typeof subscribedEvents[number]>) => {
            const { type, payload } = event;
            switch (type) {
                case 'newMessage': {
                    const { message, replyTo } = payload;
                    if (isMessageInContext(message)) {
                        shouldScrollAfterMessagesUpdate.current = isBottomVisibleRef.current;
                        setMessages((prev) => [...prev ?? [], message]);
                        if (replyTo) {
                            setRefs(prev => prev.has(replyTo.id) ? prev : new Map(prev).set(replyTo.id, replyTo));
                        }
                    }
                }
                    break;
                case 'deletedMessage': {
                    const { channelId: deletedFromChannelId, messageId } = payload;
                    if (deletedFromChannelId === channelId) {
                        setMessages((prev) => prev?.filter(m => m.id !== messageId) ?? null);
                        onMessageDeleted?.(messageId);
                    }
                }
                    break;
                case 'newReaction':
                case 'deletedReaction': {
                    const { messageId, channelId: reactionChannelId, code, userId } = payload;
                    if (reactionChannelId === channelId) {
                        const isNew = type === 'newReaction';
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
                case 'messageChildrenCountUpdated': {
                    const { messageId, childrenCount } = payload;
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
                case 'editedMessage': {
                    const { message } = payload;
                    if (message.channelId === channelId) {
                        setMessages(prev => prev?.map(msg => msg.id === message.id ? { ...msg, ...message } : msg) ?? null);
                    }
                }
                    break;
                case 'updatedUserProfile': {
                    const { id, nickname, avatarUrl } = payload;
                    const withProfile = <T extends MessageWithUser>(msg: T): T => (
                        msg.userId === id ? { ...msg, user: { ...msg.user, nickname, avatarUrl } } : msg
                    );
                    markAvatarChanged(avatarUrl);
                    setMessages(prev => prev?.map(withProfile) ?? null);
                    setReplyingTo(prev => prev && withProfile(prev));
                }
                    break;
            }
        };

        const load = async () => {
            try {
                autoScrollDone.current = false;
                setMessages(null);
                setRefs(new Map());
                setIsLoadingOlder(false);
                setHasReachedStart(false);
                setHasOlderLoadFailed(false);
                const listRes = await loadMessages(messagesInitialCount);
                if (signal.aborted) {
                    return;
                }

                setMessages(sortByCreatedAt(listRes.messages));
                setRefs(new Map(listRes.refs.map(r => [r.id, r])));
                setHasReachedStart(listRes.messages.length === 0);
            } catch (err) {
                console.error('Failed to load messages', err);
            }
        };

        const abortController = new AbortController();
        const { signal } = abortController;
        listSignalRef.current = signal;
        subscribedEvents.forEach(eventType => {
            eventEmitter.addEventListener(eventType, handleWebSocketEvent, { signal });
        });
        load();

        return () => {
            abortController.abort();
        };
    }, [apolloClient, channelId, eventEmitter, isMessageInContext, loadMessages, onMessageDeleted, userCtx?.user?.id]);

    const oldestMessageId = messages?.[0]?.id;
    const canLoadOlder = oldestMessageId !== undefined && !isLoadingOlder && !hasReachedStart && !hasOlderLoadFailed;

    // loads the next chunk of older messages whenever the top of the list is visible
    useEffect(() => {
        const scrollArea = scrollAreaRef.current;
        const target = messagesStartRef.current;
        if (!scrollArea || !target || !canLoadOlder) {
            return;
        }

        // call right before a state update that changes the content above the viewport
        const keepScrollPosition = () => {
            bottomOffsetToRestore.current = scrollArea.scrollHeight - scrollArea.scrollTop;
        };

        const loadOlder = async () => {
            const signal = listSignalRef.current;
            keepScrollPosition();
            setIsLoadingOlder(true);
            try {
                const listRes = await loadMessages(messagesChunkSize, oldestMessageId);
                if (signal?.aborted) {
                    return;
                }

                keepScrollPosition();
                if (listRes.messages.length === 0) {
                    setHasReachedStart(true);
                } else {
                    setMessages(prev => [...sortByCreatedAt(listRes.messages), ...prev ?? []]);
                    setRefs(prev => new Map([...prev, ...listRes.refs.map(r => [r.id, r] as const)]));
                }
            } catch (err) {
                console.error('Failed to load older messages', err);
                if (!signal?.aborted) {
                    keepScrollPosition();
                }

                // no automatic retry: it would loop while the top of the list stays visible
                setHasOlderLoadFailed(true);
            }

            if (!signal?.aborted) {
                setIsLoadingOlder(false);
            }
        };

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    observer.disconnect();
                    loadOlder();
                }
            },
            { root: scrollArea, threshold: 0.0 }
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [canLoadOlder, loadMessages, oldestMessageId]);

    useLayoutEffect(() => {
        if (messages !== null && !autoScrollDone.current) {
            autoScrollDone.current = true;
            scrollToBottom();
            return;
        }

        const scrollArea = scrollAreaRef.current;
        if (scrollArea && bottomOffsetToRestore.current !== null) {
            scrollArea.scrollTop = scrollArea.scrollHeight - bottomOffsetToRestore.current;
            bottomOffsetToRestore.current = null;
        }

        if (shouldScrollAfterMessagesUpdate.current) {
            shouldScrollAfterMessagesUpdate.current = false;
            scrollToBottom('smooth');
        }
    }, [messages, isLoadingOlder, hasReachedStart, hasOlderLoadFailed, scrollToBottom]);

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

    useLayoutEffect(() => {
        const messageInput = messageInputRef.current;
        if (!messageInput) {
            return;
        }

        let lastHeight = messageInput.getBoundingClientRect().height;
        const observer = new ResizeObserver((entries) => {
            const nextHeight = entries[0]?.contentRect.height ?? messageInput.getBoundingClientRect().height;
            if (nextHeight === lastHeight) {
                return;
            }

            const heightDelta = nextHeight - lastHeight;
            lastHeight = nextHeight;
            const scrollArea = scrollAreaRef.current;
            const bottomOffset = scrollArea
                ? scrollArea.scrollHeight - scrollArea.scrollTop - scrollArea.clientHeight
                : Number.POSITIVE_INFINITY;

            if (isBottomVisibleRef.current || bottomOffset <= Math.abs(heightDelta) + 2) {
                scrollToBottom();
            }
        });

        observer.observe(messageInput);

        return () => {
            observer.disconnect();
        };
    }, [scrollToBottom]);

    return (
        <div className={classNames.container}>
            <div className={classNames.header}>{header}</div>
            <div className={`${classNames.scrollArea} ${styles.scrollArea}`} ref={scrollAreaRef}>
                <div ref={messagesStartRef} />
                {(messages === null || isLoadingOlder) && (
                    <LoaderCircle className={styles.spinner} size={20} aria-label={t('chat.loadingMessages')} />
                )}
                {hasReachedStart && !!messages?.length && (
                    <div className={styles.historyStart}>{t('chat.historyStart')}</div>
                )}
                {messages?.length ? messages.map(message => {
                    const isMine = message.userId === userCtx?.user?.id;
                    return (
                        <MessageComponent
                            key={message.id}
                            currentUserId={userCtx?.user?.id}
                            message={message}
                            replyRef={message.replyTo != null ? refs.get(message.replyTo) : undefined}
                            canReply={canPostHere}
                            canEdit={canEditMessage(permissions, isMine)}
                            canDelete={canDeleteMessage(permissions, isMine)}
                            canAddReaction={permissions.canAddReactions}
                            canRemoveReaction={permissions.canRemoveReactions}
                            canCreateThread={permissions.canCreateThread}
                            onDelete={handleOnDeleteClick}
                            onReply={handleReply}
                            onEdit={handleEdit}
                            onAddReaction={handleAddReaction}
                            onDeleteReaction={handleDeleteReaction}
                            onOpenThread={onOpenThread}
                        />
                    );
                }) : emptyState}
                <div ref={messagesEndRef} />
            </div>

            {!isBottomVisible && (
                <div className={classNames.scrollUpFab} onClick={handleScrollToBottom} title={t('chat.scrollToBottom')}>
                    <ArrowDownToLine
                        size={16}
                        strokeWidth={3}
                    />
                </div>
            )}
            <div ref={messageInputRef}>
                <MessageInput
                    channelId={channelId}
                    onSend={handleSend}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={() => setEditingMessage(null)}
                    editingMessage={activeEditingMessage}
                    disabled={!canPostHere}
                    canUploadAttachments={permissions.canUploadAttachments}
                    canDeleteAttachments={permissions.canDeleteAttachments}
                    replyToMessage={activeReplyingTo}
                    onClearReply={handleClearReply}
                />
            </div>
        </div>
    );
};
