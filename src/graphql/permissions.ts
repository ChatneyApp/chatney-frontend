import {gql, TypedDocumentNode} from '@apollo/client';

export type PermissionGroup = {
    label: string;
    list: string[];
}

export type PermissionsGroupsList = {
    groups: PermissionGroup[];
}

export type GetPermissionsListResponse = {
    getPermissionsList: PermissionsGroupsList;
}

export const GET_PERMISSIONS_LIST: TypedDocumentNode<GetPermissionsListResponse> = gql`
    query getPermissionsList {
        getPermissionsList {
            groups {
                label
                list
            }
        }
    }
`;
