import { Reaction } from '@/types/messages';

import { ReactionSelectionDialog } from '../ReactionSelectionDialog';
import { MessageReaction } from '../MessageReaction';
import styles from './MessageReactions.module.css';
import { ALL_REACTION_CODES } from '@/pages/client/Chat/emojis';

type Props = {
    reactions: Reaction[];
    myReactions: string[];
    canAddReaction: boolean;
    canRemoveReaction: boolean;
    onAddReaction(code: string): void;
    onDeleteReaction(code: string): void;
}

export const MessageReactions = ({ reactions, myReactions, canAddReaction, canRemoveReaction, onAddReaction, onDeleteReaction }: Props) => (
    <div className={styles.reactionsList}>
        {reactions
            .filter(r => r.count > 0)
            .map((reaction) => {
                const isMine = myReactions.includes(reaction.code);
                return (
                    <MessageReaction
                        key={reaction.code}
                        reaction={reaction}
                        isMine={isMine}
                        disabled={isMine ? !canRemoveReaction : !canAddReaction}
                        onAddReaction={onAddReaction}
                        onDeleteReaction={onDeleteReaction}
                    />
                );
            })}
        {canAddReaction && (
            <ReactionSelectionDialog
                reactions={ALL_REACTION_CODES}
                onSelect={onAddReaction}
                myReactions={myReactions}
            />
        )}
    </div>
);
