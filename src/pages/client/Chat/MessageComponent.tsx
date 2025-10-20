import { HTMLProps, PropsWithChildren } from 'react';
import { MessageWithUser } from '@/types/messages';
import { isDev } from '@/helpers/env';
import { MessageReactions } from '@/pages/client/Chat/MessageReactions.tsx';

const DeleteButton = ({ children, onClick }: PropsWithChildren & HTMLProps<HTMLButtonElement>) => (
    <button className="inline-block text-amber-700 p-2 cursor-pointer" onClick={onClick}>
        {children}
    </button>
);
type Props = {
    message: MessageWithUser;
    onDelete(id: string): void;
    onAddReaction(messageId: string, code: string): void;
    onDeleteReaction(messageId: string, code: string): void;
};
export const MessageComponent = ({ message, onDelete, onAddReaction, onDeleteReaction }: Props) => (
    <div data-id={isDev ? message.id : null} key={message.id} className="flex items-start space-x-4">
        <img src={message.user?.avatarUrl ?? 'https://i.pravatar.cc/40?img=1'} alt={message.userId} className="w-10 h-10 rounded-full" />
        <div>
            <div className="flex items-center space-x-2">
                <span className="font-medium">{message.user?.name ?? message.userId}</span>
                <span className="text-xs text-gray-500">{new Date(message.createdAt).toISOString()}</span>
                <DeleteButton onClick={() => onDelete(message.id)}>x</DeleteButton>
            </div>
            <p className="text-gray-200">{message.content}</p>
            <MessageReactions
                reactions={message.reactions}
                myReactions={[]}
                onAddReaction={(code) => onAddReaction(message.id, code)}
                onDeleteReaction={code => onDeleteReaction(message.id, code)}
            />
        </div>
    </div>
);
