import { useCallback } from 'react';
import { MessagesSquare, X } from 'lucide-react';
import { useApolloClient } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

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
    isDm: boolean;
    eventEmitter: WebSocketEventEmitter;
    onCloseThread(): void;
};

export const Thread = ({ rootMessage, isDm, eventEmitter, onCloseThread }: Props) => {
    const { t } = useTranslation();
    const apolloClient = useApolloClient();

    const loadMessages = useCallback(() => {
        return getThreadMessagesList(apolloClient, rootMessage.id);
    }, [apolloClient, rootMessage.id]);

    const isMessageInContext = useCallback((message: MessageWithUser) => {
        return message.parentId === rootMessage.id;
    }, [rootMessage.id]);

    const header = (
        <>
            <MessagesSquare className={styles.headerIcon} />
            <span className={styles.headerTitle}>{t('chat.thread.title')}</span>
            <X
                className={styles.closeButton}
                onClick={onCloseThread}
            />
        </>
    );

    return (
        <ChatMessageList
            channelId={rootMessage.channelId}
            isDm={isDm}
            parentId={rootMessage.id}
            header={header}
            classNames={classNames}
            eventEmitter={eventEmitter}
            loadMessages={loadMessages}
            isMessageInContext={isMessageInContext}
            emptyState={<div>{t('chat.emptyMessages')}</div>}
        />
    );
};
