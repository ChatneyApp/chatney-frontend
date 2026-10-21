import type { GetPermissionsListQuery, GetSecureObjectsQuery, Permission, RoleAclFieldsFragment } from '@/graphql/generated/graphql';

export type { Permission };
export type RoleAcl = RoleAclFieldsFragment;
export type SecureObjectList = GetSecureObjectsQuery['acls']['secureObjects'];
export type PermissionGroup = GetPermissionsListQuery['permissions']['list'][number];
