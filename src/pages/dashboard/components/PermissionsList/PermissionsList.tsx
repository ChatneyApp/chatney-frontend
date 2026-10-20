import { Suspense } from 'react';
import { useSuspenseQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { formatPermissionLabel } from '@/helpers/permissions';

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
                    label={formatPermissionLabel(permission)}
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

export const PermissionsList = () => {
    const { t } = useTranslation();

    return (
        <Suspense fallback={<div>{t('common.loading')}</div>}>
            <PermissionsListCore/>
        </Suspense>
    );
};
