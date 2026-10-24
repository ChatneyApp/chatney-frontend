import type { Permission } from '../graphql/generated/graphql';

export type RoleAclDraft = {
    secObjId: number;
    permissions: Permission[];
};

export type RoleAclsDiff = {
    upserts: RoleAclDraft[];
    deletes: number[];
};

function samePermissions(a: Permission[], b: Permission[]) {
    const set = new Set(a);
    return set.size === new Set(b).size && b.every((permission) => set.has(permission));
}

/**
 * Turns the edited ACL list into the setRoleAcl/deleteRoleAcl calls needed to store it.
 * An entry with no permissions left is deleted, like setRoleAcl does with an empty list.
 */
export function diffRoleAcls(initial: RoleAclDraft[], next: RoleAclDraft[]): RoleAclsDiff {
    const initialBySecObjId = new Map(initial.map((acl) => [acl.secObjId, acl.permissions]));
    const nextSecObjIds = new Set(next.filter((acl) => acl.permissions.length > 0).map((acl) => acl.secObjId));

    const upserts = next.filter((acl) => {
        if (acl.permissions.length === 0) {
            return false;
        }

        const initialPermissions = initialBySecObjId.get(acl.secObjId);
        return !initialPermissions || !samePermissions(initialPermissions, acl.permissions);
    });

    const deletes = initial
        .map((acl) => acl.secObjId)
        .filter((secObjId) => !nextSecObjIds.has(secObjId));

    return { upserts, deletes };
}
