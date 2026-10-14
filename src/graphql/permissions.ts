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
