import { Reaction } from '@/types/messages';

import styles from './MessageReactions.module.css';
import { ReactionSelectionDialog } from '@/pages/client/Chat/ReactionSelectionDialog';

type Props = {
    reactions: Reaction[];
    myReactions: string[];
    onAddReaction(code: string): void;
    onDeleteReaction(code: string): void;
}

export const MessageReactions = ({ reactions, myReactions, onAddReaction, onDeleteReaction }: Props) => (
    <div className={styles.reactionsList}>
        {reactions.map((reaction) => (
            <div
                key={reaction.code}
                className={styles.reaction}
                onClick={
                    () => {
                        if (myReactions.includes(reaction.code)) {
                            onDeleteReaction(reaction.code);
                        } else {
                            onAddReaction(reaction.code);
                        }
                    }
                }
            >[{reaction.count}] {reaction.code}</div>
        ))}
        <ReactionSelectionDialog
            reactions={[ 'fire', 'smile', 'fff' ]}
            onSelect={onAddReaction}
        />
    </div>
);
