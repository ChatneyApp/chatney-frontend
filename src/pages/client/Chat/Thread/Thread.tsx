import { useCallback } from 'react';
import { PanelRightClose } from 'lucide-react';
import { useApolloClient } from '@apollo/client/react';

import { WebSocketEventEmitter } from '@/communication/WebSocketEventEmitter';
import { getThreadMessagesList } from '@/graphql/messages';
import { ChatMessageList } from '@/pages/client/Chat/ChatMessageList';
import { MessageWithUser } from '@/types/messages';

import styles from './Thread.module.css';

const classNames = {
    container: styles.container,
    header: styles.header,
    scrollArea: styles.scrollArea,
    scrollUpFab: styles.scrollUpFab,
};

type Props = {
    rootMessage: MessageWithUser;
    eventEmitter: WebSocketEventEmitter;
    onCloseThread(): void;
};

export const Thread = ({ rootMessage, eventEmitter, onCloseThread }: Props) => {
    const apolloClient = useApolloClient();

    const loadMessages = useCallback(() => {
        return getThreadMessagesList(apolloClient, rootMessage.id);
    }, [apolloClient, rootMessage.id]);

    const isMessageInContext = useCallback((message: MessageWithUser) => {
        return message.parentId === rootMessage.id;
    }, [rootMessage.id]);

    const header = (
        <>
            <PanelRightClose
                className="cursor-pointer inline-block mr-2 text-red-500"
                onClick={onCloseThread}
            />
            Thread
        </>
    );

    return (
        <ChatMessageList
            channelId={rootMessage.channelId}
            parentId={rootMessage.id}
            header={header}
            classNames={classNames}
            eventEmitter={eventEmitter}
            loadMessages={loadMessages}
            isMessageInContext={isMessageInContext}
            emptyState={<div>No messages here yet</div>}
        />
    );
};
