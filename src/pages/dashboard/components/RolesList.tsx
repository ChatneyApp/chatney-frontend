import {Suspense} from 'react';

import {RoleEditor} from '@/pages/dashboard/components/RoleEditor/RoleEditor';
import {CreateRoleForm} from '@/pages/dashboard/components/RoleForm/CreateRoleForm';
import {RolesListProvider, useRolesList} from '@/contexts/RolesListContext';
import {EmptyListMessage} from '@/pages/dashboard/components/EmptyListMessage';

const RolesListCore = () => {
    const {roles} = useRolesList();

    return <div>
        {roles.map(role => (
            <RoleEditor key={role.id} role={role}/>
        ))}
        {!roles.length && (
            <EmptyListMessage>
                No roles found. Create one using the form above.
            </EmptyListMessage>
        )}
    </div>;
};

export const RolesList = () => (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <RolesListProvider>
                <CreateRoleForm cta="Create role" title="Create Role" submitText="Create Role"/>
                <RolesListCore/>
            </RolesListProvider>
        </Suspense>
    </>
);
