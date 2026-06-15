import { Reaction } from '@/types/messages';

import { ReactionSelectionDialog } from '../ReactionSelectionDialog';
import { MessageReaction } from '../MessageReaction';
import styles from './MessageReactions.module.css';
import { ALL_REACTION_CODES } from '@/pages/client/Chat/emojis';

type Props = {
    reactions: Reaction[];
    myReactions: string[];
    onAddReaction(code: string): void;
    onDeleteReaction(code: string): void;
}

export const MessageReactions = ({ reactions, myReactions, onAddReaction, onDeleteReaction }: Props) => (
    <div className={styles.reactionsList}>
        {reactions
            .filter(r => r.count > 0)
            .map((reaction) => (
                <MessageReaction
                    key={reaction.code}
                    reaction={reaction}
                    isMine={myReactions.includes(reaction.code)}
                    onAddReaction={onAddReaction}
                    onDeleteReaction={onDeleteReaction}
                />
            ))}
        <ReactionSelectionDialog
            reactions={ALL_REACTION_CODES}
            onSelect={onAddReaction}
            myReactions={myReactions}
        />
    </div>
);
