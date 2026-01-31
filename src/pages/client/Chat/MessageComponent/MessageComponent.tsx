import { HTMLProps, PropsWithChildren } from 'react';
import clsx from 'clsx';
import { MessageWithUser } from '@/types/messages';
import { isDev } from '@/helpers/env';
import { MessageReactions } from '@/pages/client/Chat/MessageReactions';
import { MessageThreadButton } from '@/pages/client/Chat/MessageThreadButton';
import { MessageUrlPreviewsComponent } from '@/pages/client/Chat/MessageUrlPreviewsComponent';
import { UserId } from '@/types/users';
import { formatTimestamp } from '@/helpers/formatTimestamp';

import styles from './MessageComponent.module.css';

const DeleteButton = ({ children, onClick }: PropsWithChildren & HTMLProps<HTMLButtonElement>) => (
    <button className="inline-block text-amber-700 p-2 cursor-pointer" onClick={onClick}>
        {children}
    </button>
);
type Props = {
    message: MessageWithUser;
    currentUserId?: UserId;
    onDelete(id: string): void;
    onAddReaction(messageId: string, code: string): void;
    onDeleteReaction(messageId: string, code: string): void;
    onOpenThread?(parentId: MessageWithUser): void;
};
export const MessageComponent = ({ message, currentUserId, onDelete, onAddReaction, onDeleteReaction, onOpenThread }: Props) => {
    const isMine = message.userId === currentUserId;
    const avatarUrl = message.user.avatarUrl ?? `https://i.pravatar.cc/?img=${message.userId.substring(0, 1)}`;
    const handleToggleThread = () => {
        console.log('toggle thread for message id = ', message.id);
        onOpenThread?.(message);
    };

    return (
        <div
            data-id={isDev ? message.id : null}
            key={message.id}
            className={clsx(styles.container, { [styles.isMine]: isMine })}
        >
            {!isMine && (
                <img
                    src={avatarUrl}
                    alt={message.user.name}
                    className={styles.avatar}
                />
            )}
            <div>
                <div className="flex items-center space-x-2">
                    {!isMine && (
                        <span className="font-medium">
                            {message.user?.name ?? message.userId}
                        </span>
                    )}
                    <span className="text-xs text-yellow-500">{formatTimestamp(new Date(message.createdAt))}</span>
                    <DeleteButton onClick={() => onDelete(message.id)}>x</DeleteButton>
                </div>
                <p className="text-gray-200 break-all">{message.content}</p>
                <MessageUrlPreviewsComponent urlPreviews={message.urlPreviews}/>
                <MessageReactions
                    reactions={message.reactions}
                    myReactions={message.myReactions}
                    onAddReaction={(code) => onAddReaction(message.id, code)}
                    onDeleteReaction={code => onDeleteReaction(message.id, code)}
                />

                {onOpenThread && (
                    <MessageThreadButton
                        count={message.childrenCount ?? 0}
                        onToggleThread={handleToggleThread}
                    />
                )}
            </div>
        </div>
    );
}
