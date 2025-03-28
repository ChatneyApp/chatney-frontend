import {Suspense, useState} from 'react';
import {gql, type TypedDocumentNode, useSuspenseQuery} from '@apollo/client';

import {Role} from '@/types/roles';
import {RoleEditor} from '@/pages/dashboard/components/RoleEditor';

type GetRolesListResponse = {
    getRolesList: Role[];
}

const GET_ROLES_QUERY: TypedDocumentNode<GetRolesListResponse> = gql`
    {
        getRolesList {
            Id
            Name
            Permissions
            Settings {
                Base
            }
        }
    }
`;

const RolesListCore = () => {
    const {data: {getRolesList: roles}} = useSuspenseQuery(GET_ROLES_QUERY);
    console.log('loaded data', roles);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const showDialog = () => setIsAddDialogVisible(true);
    const hideDialog = () => setIsAddDialogVisible(false);

    return <>
        {!isAddDialogVisible && (
            <button onClick={showDialog}>Add role</button>
        )}
        {isAddDialogVisible && (
            <div>
                TODO: add role dialog
                <button onClick={hideDialog}>Close</button>
            </div>
        )}
        {roles.map(role => (
            <RoleEditor key={role.Id} role={role}/>
        ))}
    </>;
}

export const RolesList = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <RolesListCore/>
    </Suspense>
);
