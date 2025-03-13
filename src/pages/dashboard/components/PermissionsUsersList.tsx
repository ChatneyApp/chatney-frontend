import {Suspense} from 'react';
import {gql, type TypedDocumentNode, useSuspenseQuery} from '@apollo/client';

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

const ToDoEl = () => {
    const {data: {getPermissionsList: {groups}}} = useSuspenseQuery(GET_PERMISSIONS_QUERY);

    console.log('loaded data', groups);

    return <>
        Groups:
        <ul>
            {groups.map(({label, list}) => (
                <li key={label}>
                    <b>{label}</b>
                    <ul>
                        {list.map(permission => (
                            <li key={permission}>{permission}</li>
                        ))}
                    </ul>
                </li>
            ))}
        </ul>
    </>;
}

export const PermissionsUsersList = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <ToDoEl/>
    </Suspense>
);
