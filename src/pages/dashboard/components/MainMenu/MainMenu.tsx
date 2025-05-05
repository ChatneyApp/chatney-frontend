import {PropsWithChildren} from 'react';
import {NavLink, type NavLinkRenderProps} from 'react-router';
import {HomeIcon} from 'lucide-react';

import styles from './MainMenu.module.css';

const MenuItem = ({children}: PropsWithChildren) => (
    <button className={styles.menuItem}>
        {children}
    </button>
);

const isActiveLink =
    ({isActive}: NavLinkRenderProps) => isActive ? styles.activeLink : undefined;

export const MainMenu = () => (
    <div className={styles.menu}>
        <MenuItem>
            <NavLink to="/dashboard">
                <HomeIcon/>
            </NavLink>
        </MenuItem>
        <MenuItem>
            <NavLink to="/dashboard/permissions" className={isActiveLink}>Permissions</NavLink>
        </MenuItem>
        <MenuItem>
            <NavLink to="/dashboard/roles" className={isActiveLink}>Roles</NavLink>
        </MenuItem>
        <MenuItem>
            <NavLink to="/dashboard/channelTypes" className={isActiveLink}>Channel types</NavLink>
        </MenuItem>
        <MenuItem>
            <NavLink to="/dashboard/workspaces" className={isActiveLink}>Workspaces</NavLink>
        </MenuItem>
        <MenuItem>
            <NavLink to="/dashboard/channels" className={isActiveLink}>Channels</NavLink>
        </MenuItem>
        <MenuItem>
            <NavLink to="/dashboard/channelGroups" className={isActiveLink}>Channel groups</NavLink>
        </MenuItem>
        <MenuItem>
            <NavLink to="/dashboard/users" className={isActiveLink}>Users</NavLink>
        </MenuItem>
    </div>
);
