import { graphql } from '@/graphql/generated';

export const GET_PERMISSIONS_LIST = graphql(`
    query GetPermissionsList {
        permissions {
            list {
                label
                list
            }
        }
    }
`);

export const GET_MY_PERMISSIONS = graphql(`
    query GetMyPermissions {
        users {
            myPermissions {
                channels {
                    id
                    permissions
                }
            }
        }
    }
`);
