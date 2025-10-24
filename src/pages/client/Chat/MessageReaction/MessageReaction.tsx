import clsx from 'clsx';
import { Reaction } from '@/types/messages';

import styles from './MessageReaction.module.css';

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
        <div
            key={reaction.code}
            className={clsx(styles.reaction, { [styles.mine]: isMine })}
            onClick={handleClick}
        >
            <div className={styles.reactionBody}>{reaction.code}</div>
            <div className={styles.counter}>{reaction.count}</div>
        </div>
    );
};
