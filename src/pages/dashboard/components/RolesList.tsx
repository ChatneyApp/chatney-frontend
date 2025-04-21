import {Suspense} from 'react';

import {RoleEditor} from '@/pages/dashboard/components/RoleEditor';
import {CreateRoleForm} from '@/pages/dashboard/components/CreateRoleForm';
import {RolesListProvider, useRolesList} from '@/contexts/RolesListContext';

const RolesListCore = () => {
    const {roles} = useRolesList();

    return <div>
        {roles.map(role => (
            <RoleEditor key={role.Id} role={role}/>
        ))}
    </div>;
};

export const RolesList = () => (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <RolesListProvider>
                <CreateRoleForm cta="Create role" submitText="Create Role"/>
                <RolesListCore/>
            </RolesListProvider>
        </Suspense>
    </>
);
