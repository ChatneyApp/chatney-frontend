import { CornerUpLeft, Pencil, XCircle } from 'lucide-react';
import clsx from 'clsx';
import { MessageId, MessageWithUser, ReplyToMessage } from '@/types/messages';
import { isDev } from '@/helpers/env';
import { MessageReactions } from '@/pages/client/Chat/MessageReactions';
import { MessageThreadButton } from '@/pages/client/Chat/MessageThreadButton';
import { MessageUrlPreviewsComponent } from '@/pages/client/Chat/MessageUrlPreviewsComponent';
import { UserId } from '@/types/users';
import { formatTimestamp } from '@/helpers/formatTimestamp';
import { MessageAttachments } from '@/pages/client/Chat/MessageAttachments';

import styles from './MessageComponent.module.css';

type Props = {
    message: MessageWithUser;
    currentUserId?: UserId;
    replyRef?: ReplyToMessage;
    onDelete(id: MessageId): void;
    onReply(message: MessageWithUser): void;
    onEdit(message: MessageWithUser): void;
    onAddReaction(messageId: MessageId, code: string): void;
    onDeleteReaction(messageId: MessageId, code: string): void;
    onOpenThread?(parentId: MessageWithUser): void;
};
export const MessageComponent = ({ message, currentUserId, replyRef, onDelete, onReply, onEdit, onAddReaction, onDeleteReaction, onOpenThread }: Props) => {
    const isMine = message.userId === currentUserId;
    const avatarUrl = message.user.avatarUrl ?? `https://i.pravatar.cc/?img=${message.userId}`;
    const handleToggleThread = () => {
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
            <div className={styles.innerContainer}>
                <div className={styles.header}>
                    {!isMine && (
                        <span className="font-medium">
                            {message.user?.name ?? message.userId}
                        </span>
                    )}
                    <span className={styles.timestamp}>
                        {formatTimestamp(new Date(message.updatedAt))}
                    </span>
                    <CornerUpLeft
                        className={styles.replyButton}
                        onClick={() => onReply(message)}
                    />
                    {isMine && (
                        <Pencil
                            className={styles.editButton}
                            onClick={() => onEdit(message)}
                        />
                    )}
                    <XCircle
                        className={styles.deleteButton}
                        onClick={() => onDelete(message.id)}
                    />
                </div>
                {replyRef && (
                    <div className={styles.replyQuote}>
                        {replyRef.content.length > 80 ? replyRef.content.slice(0, 80) + '…' : replyRef.content}
                    </div>
                )}
                <div className={styles.textContent}>
                    {message.content}
                    {new Date(message.updatedAt).getTime() !== new Date(message.createdAt).getTime() && (
                        <span className={styles.editedLabel}> (edited)</span>
                    )}
                </div>
                <MessageAttachments attachments={message.attachments}/>
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
