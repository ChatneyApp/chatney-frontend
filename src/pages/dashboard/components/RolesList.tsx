import {Suspense} from 'react';
import {useSuspenseQuery} from '@apollo/client';

import {RoleEditor} from '@/pages/dashboard/components/RoleEditor';
import {CreateRoleForm} from '@/pages/dashboard/components/CreateRoleForm';
import {GET_ROLES_QUERY} from '@/graphql/roles';

const RolesListCore = () => {
    const {data: {getRolesList: roles}} = useSuspenseQuery(GET_ROLES_QUERY);

    return <div>
        {roles.map(role => (
            <RoleEditor key={role.Id} role={role}/>
        ))}
    </div>;
};

export const RolesList = () => (
    <>
        <CreateRoleForm cta="Create role" submitText="Create Role"/>
        <Suspense fallback={<div>Loading...</div>}>
            <RolesListCore/>
        </Suspense>
    </>
);
