import {MainMenu} from '@/pages/home/components/MainMenu/MainMenu';
import styles from './HomePage.module.css';

export const HomePage = () => (
    <div className={styles.page}>
        <h1 className="text-red-700">Home</h1>
        <MainMenu/>
    </div>
);
