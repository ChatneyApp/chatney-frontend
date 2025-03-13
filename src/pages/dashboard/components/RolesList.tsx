import {Suspense} from 'react';
import {gql, type TypedDocumentNode, useSuspenseQuery} from '@apollo/client';

type Role = {
    name: string;
    settings: {
        base: string;
    }
    permissions: string[];
}

type Roles = {
    roles: Role[];
}

type GetRolesListResponse = {
    getRoles: Roles;
}

const GET_ROLES_QUERY: TypedDocumentNode<GetRolesListResponse> = gql`
    {
        getRoles {
        }
    }
`;

const RolesListCore = () => {
    const {data: {getRoles: {roles}}} = useSuspenseQuery(GET_ROLES_QUERY);

    console.log('loaded data', roles);

    return <>
        Roles...
    </>;
}

export const RolesList = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <RolesListCore/>
    </Suspense>
);
