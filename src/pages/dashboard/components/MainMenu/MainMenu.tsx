import { PropsWithChildren } from 'react';
import { NavLink, type NavLinkRenderProps } from 'react-router';
import { HomeIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import styles from './MainMenu.module.css';

const MenuItem = ({ children }: PropsWithChildren) => (
    <button className={styles.menuItem}>
        {children}
    </button>
);

const isActiveLink =
    ({ isActive }: NavLinkRenderProps) => isActive ? styles.activeLink : undefined;

export const MainMenu = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.menu}>
            <MenuItem>
                <NavLink to="/dashboard" aria-label={t('dashboard.menu.home')}>
                    <HomeIcon/>
                </NavLink>
            </MenuItem>
            <MenuItem>
                <NavLink to="/dashboard/permissions" className={isActiveLink}>{t('dashboard.menu.permissions')}</NavLink>
            </MenuItem>
            <MenuItem>
                <NavLink to="/dashboard/roles" className={isActiveLink}>{t('dashboard.menu.roles')}</NavLink>
            </MenuItem>
            <MenuItem>
                <NavLink to="/dashboard/channelTypes" className={isActiveLink}>{t('dashboard.menu.channelTypes')}</NavLink>
            </MenuItem>
            <MenuItem>
                <NavLink to="/dashboard/workspaces" className={isActiveLink}>{t('dashboard.menu.workspaces')}</NavLink>
            </MenuItem>
            <MenuItem>
                <NavLink to="/dashboard/channels" className={isActiveLink}>{t('dashboard.menu.channels')}</NavLink>
            </MenuItem>
            <MenuItem>
                <NavLink to="/dashboard/channelGroups" className={isActiveLink}>{t('dashboard.menu.channelGroups')}</NavLink>
            </MenuItem>
            <MenuItem>
                <NavLink to="/dashboard/users" className={isActiveLink}>{t('dashboard.menu.users')}</NavLink>
            </MenuItem>
            <MenuItem>
                <NavLink to="/dashboard/config" className={isActiveLink}>{t('dashboard.menu.config')}</NavLink>
            </MenuItem>
        </div>
    );
};
