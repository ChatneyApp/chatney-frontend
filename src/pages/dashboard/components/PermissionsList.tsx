import {Suspense} from 'react';
import {gql, type TypedDocumentNode, useSuspenseQuery} from '@apollo/client';

import styles from './PermissionsList.module.css';

type PermissionGroup = {
    label: string;
    list: string[];
}

type PermissionsGroupsList = {
    groups: PermissionGroup[];
}

type GetPermissionsListResponse = {
    getPermissionsList: PermissionsGroupsList;
}

const GET_PERMISSIONS_QUERY: TypedDocumentNode<GetPermissionsListResponse> = gql`
    {
        getPermissionsList {
            groups {
                label
                list
            }
        }
    }
`;

const Permission = ({label}: {label: string}) => (
    <li className={styles.permission}>{label}</li>
);

type PermissionGroupProps = {
    label: string;
    permissions: string[];
};
const PermissionGroup = ({label, permissions}: PermissionGroupProps) => (
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
    const {data: {getPermissionsList: {groups}}} = useSuspenseQuery(GET_PERMISSIONS_QUERY);

    return <>
        <ul className={styles.list}>
            {groups.map(({label, list}) => (
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
