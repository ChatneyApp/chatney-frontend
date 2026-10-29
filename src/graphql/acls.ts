import { graphql } from '@/graphql/generated';

export const RoleAclFieldsFragment = graphql(`
    fragment RoleAclFields on RoleAcl {
        roleId
        secObjId
        permissions
    }
`);

export const GET_ROLE_ACLS = graphql(`
    query GetRoleAcls($roleId: Int!) {
        acls {
            roleAcls(roleId: $roleId) {
                ...RoleAclFields
            }
        }
    }
`);

export const GET_SECURE_OBJECTS = graphql(`
    query GetSecureObjects {
        acls {
            secureObjects {
                workspaces {
                    ...WorkspaceFields
                }
                channelTypes {
                    ...ChannelTypeFields
                }
                channels {
                    ...ChannelFields
                }
            }
        }
    }
`);

export const SET_ROLE_ACL = graphql(`
    mutation SetRoleAcl($roleId: Int!, $secObjId: Int!, $permissions: [Permission!]!) {
        acls {
            setRoleAcl(roleId: $roleId, secObjId: $secObjId, permissions: $permissions) {
                ...RoleAclFields
            }
        }
    }
`);

export const DELETE_ROLE_ACL = graphql(`
    mutation DeleteRoleAcl($roleId: Int!, $secObjId: Int!) {
        acls {
            deleteRoleAcl(roleId: $roleId, secObjId: $secObjId)
        }
    }
`);
