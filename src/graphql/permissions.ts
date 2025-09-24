import {gql, TypedDocumentNode} from '@apollo/client';

export type PermissionGroup = {
    label: string;
    list: string[];
}

export type GetPermissionsListResponse = {
    permissions: {
        list: PermissionGroup[];
    }
}

export const GET_PERMISSIONS_LIST: TypedDocumentNode<GetPermissionsListResponse> = gql`
    query getPermissionsList {
        permissions {
            list {
                label
                list
            }
        }
    }
`;
