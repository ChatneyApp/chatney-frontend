import { useCallback } from 'react';
import { useApolloClient } from '@apollo/client/react';

import { WebSocketEventEmitter } from '@/communication/WebSocketEventEmitter';
import { getChannelMessagesList } from '@/graphql/messages';
import { ChatMessageList } from '@/pages/client/Chat/ChatMessageList';
import { ChannelListItem } from '@/pages/client/Chat/types';
import { MessageId, MessageWithUser } from '@/types/messages';

import styles from './MessagesList.module.css';

const classNames = {
    container: styles.container,
    header: styles.header,
    scrollArea: styles.scrollArea,
    scrollUpFab: styles.scrollUpFab,
};

type Props = {
    activeChannel: ChannelListItem;
    activeThreadId?: MessageId;
    onCloseThread(): void;
    eventEmitter: WebSocketEventEmitter;
    onOpenThread(parentId: MessageWithUser): void;
};

export function MessagesList({ activeChannel, activeThreadId, eventEmitter, onCloseThread, onOpenThread }: Props) {
    const apolloClient = useApolloClient();

    const loadMessages = useCallback(() => {
        return getChannelMessagesList(apolloClient, activeChannel.id);
    }, [activeChannel.id, apolloClient]);

    const isMessageInContext = useCallback((message: MessageWithUser) => {
        return message.channelId === activeChannel.id && !message.parentId;
    }, [activeChannel.id]);

    const handleMessageDeleted = useCallback((messageId: MessageId) => {
        if (messageId === activeThreadId) {
            onCloseThread();
        }
    }, [activeThreadId, onCloseThread]);

    return (
        <ChatMessageList
            channelId={activeChannel.id}
            parentId={null}
            header={`# ${activeChannel.name}`}
            classNames={classNames}
            eventEmitter={eventEmitter}
            loadMessages={loadMessages}
            isMessageInContext={isMessageInContext}
            onMessageDeleted={handleMessageDeleted}
            onOpenThread={onOpenThread}
        />
    );
}
