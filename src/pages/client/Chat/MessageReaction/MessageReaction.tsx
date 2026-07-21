import clsx from 'clsx';
import { Reaction } from '@/types/messages';

import styles from './MessageReaction.module.css';
import { REACTION_DETAILS } from '@/pages/client/Chat/emojis.ts';

type Props = {
    reaction: Reaction;
    isMine: boolean;
    onAddReaction(code: string): void;
    onDeleteReaction(code: string): void;
}

export const MessageReaction = ({ reaction, isMine, onAddReaction, onDeleteReaction }: Props) => {
    const handleClick = () => {
        if (isMine) {
            onDeleteReaction(reaction.code);
        } else {
            onAddReaction(reaction.code);
        }
    };

    return (
        <button
            type="button"
            key={reaction.code}
            className={clsx(styles.reaction, { [styles.mine]: isMine })}
            onClick={handleClick}
            aria-label={`${reaction.code} reaction count ${reaction.count}`}
        >
            <div className={styles.reactionBody}>{REACTION_DETAILS[reaction.code].emoji}</div>
            <div className={styles.counter}>{reaction.count}</div>
        </button>
    );
};
