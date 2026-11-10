import clsx from 'clsx';
import { MessageCircleText } from 'lucide-react';

import styles from './MessageThreadButton.module.css';

type Props = {
    count: number;
    onToggleThread(): void;
}

export const MessageThreadButton = ({ count, onToggleThread }: Props) => (
    <div className={clsx(styles.container, { [styles.isEmpty]: count === 0 })}>
        <div className={styles.button}>
            <MessageCircleText
                size={18}
                strokeWidth={3}
                onClick={onToggleThread}
            />
            <div className={styles.counter}>{count}</div>
        </div>
    </div>
);
