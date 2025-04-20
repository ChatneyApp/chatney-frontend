import {gql} from '@apollo/client';

export const GET_PERMISSIONS_LIST = gql`
    query getPermissionsList {
        getPermissionsList {
            groups {
                label
                list
            }
        }
    }
`;
