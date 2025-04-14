import {PropsWithChildren} from 'react';
import {Link} from 'react-router';
import {HomeIcon} from 'lucide-react';

import styles from './MainMenu.module.css';

const MenuItem = ({children}: PropsWithChildren) => (
    <button className={styles.menuItem}>
        {children}
    </button>
);

export const MainMenu = () => (
    <div className={styles.menu}>
        <MenuItem>
            <Link to="/dashboard">
                <HomeIcon/>
            </Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/permissions">Permissions</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/roles">Roles</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/channelTypes">Channel types</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/channels">Channels</Link>
        </MenuItem>
        <MenuItem>
            <Link to="/dashboard/users">Users</Link>
        </MenuItem>
    </div>
);
