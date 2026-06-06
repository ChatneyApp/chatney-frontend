import styles from './ProgressBar.module.css';

type Props = {
    label: string;
    progress: number;
};

export const ProgressBar = ({ label, progress }: Props) => {
    const percent = Math.max(0, Math.min(100, Math.round(progress * 100)));

    return (
        <div className={styles.progress}>
            <div className={styles.progressLabel}>
                <span>{label}</span>
                <span>{percent}%</span>
            </div>
            <div className={styles.progressTrack}>
                <div className={styles.progressFill} style={{ width: `${percent}%` }} />
            </div>
        </div>
    );
};
