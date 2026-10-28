import { MessageCircleText } from 'lucide-react';

import styles from './MessageThreadButton.module.css';

type Props = {
    count: number;
    onToggleThread(): void;
}

export const MessageThreadButton = ({ count, onToggleThread }: Props) => (
    <div className={styles.container}>
        <div className={styles.button}>
            <MessageCircleText
                size={16}
                strokeWidth={3}
                onClick={onToggleThread}
            />
        </div>
        <div className={styles.counter}>{count}</div>
    </div>
);
