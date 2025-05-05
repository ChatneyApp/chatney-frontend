import {PropsWithChildren} from 'react';
import {Link} from 'react-router';

import styles from './MainMenu.module.css';

const MenuItem = ({children}: PropsWithChildren) => (
    <button className={styles.menuItem}>
        {children}
    </button>
);

export const MainMenu = () => (
    <div className={styles.menu}>
        <MenuItem>
            <Link to="/client">Client</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard">Dashboard</Link>
        </MenuItem>
    </div>
);
