import {gql, TypedDocumentNode} from '@apollo/client';

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
