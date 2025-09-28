import { Suspense } from 'react';
import { useSuspenseQuery } from '@apollo/client';

import styles from './PermissionsList.module.css';
import { GET_PERMISSIONS_LIST } from '@/graphql/permissions';

const Permission = ({ label }: {label: string}) => (
    <li className={styles.permission}>{label}</li>
);

type PermissionGroupProps = {
    label: string;
    permissions: string[];
};
const PermissionGroup = ({ label, permissions }: PermissionGroupProps) => (
    <li key={label} className={styles.group}>
        <label>{label}</label>
        <ul>
            {permissions.map(permission => (
                <Permission
                    key={permission}
                    label={permission}
                />
            ))}
        </ul>
    </li>
);

const PermissionsListCore = () => {
    const { data: { permissions: { list: groups } } } = useSuspenseQuery(GET_PERMISSIONS_LIST);

    return <>
        <ul className={styles.list}>
            {groups.map(({ label, list }) => (
                <PermissionGroup
                    key={label}
                    label={label}
                    permissions={list}
                />
            ))}
        </ul>
    </>;
}

export const PermissionsList = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <PermissionsListCore/>
    </Suspense>
);
