import { diffRoleAcls, RoleAclDraft } from './roleAcls';

const initial: RoleAclDraft[] = [
    { secObjId: 1, permissions: ['ROLE_EDIT_ROLE', 'USER_READ_USER'] },
    { secObjId: 2, permissions: ['WORKSPACE_READ_WORKSPACE'] },
];

describe('diffRoleAcls', () => {
    it('returns nothing when nothing changed', () => {
        expect(diffRoleAcls(initial, initial)).toEqual({ upserts: [], deletes: [] });
    });

    it('ignores a different permission order', () => {
        const next: RoleAclDraft[] = [
            { secObjId: 1, permissions: ['USER_READ_USER', 'ROLE_EDIT_ROLE'] },
            initial[1],
        ];

        expect(diffRoleAcls(initial, next)).toEqual({ upserts: [], deletes: [] });
    });

    it('upserts an added object', () => {
        const added: RoleAclDraft = { secObjId: 21, permissions: ['CHANNEL_READ_CHANNEL'] };

        expect(diffRoleAcls(initial, [...initial, added])).toEqual({ upserts: [added], deletes: [] });
    });

    it('skips an added object with no permissions', () => {
        const next: RoleAclDraft[] = [...initial, { secObjId: 21, permissions: [] }];

        expect(diffRoleAcls(initial, next)).toEqual({ upserts: [], deletes: [] });
    });

    it('upserts an object whose permissions changed', () => {
        const changed: RoleAclDraft = { secObjId: 2, permissions: ['WORKSPACE_READ_WORKSPACE', 'WORKSPACE_UPDATE_WORKSPACE'] };

        expect(diffRoleAcls(initial, [initial[0], changed])).toEqual({ upserts: [changed], deletes: [] });
    });

    it('deletes a removed object', () => {
        expect(diffRoleAcls(initial, [initial[0]])).toEqual({ upserts: [], deletes: [2] });
    });

    it('deletes an object with every permission unticked', () => {
        const next: RoleAclDraft[] = [initial[0], { secObjId: 2, permissions: [] }];

        expect(diffRoleAcls(initial, next)).toEqual({ upserts: [], deletes: [2] });
    });

    it('handles adds, changes and removals together', () => {
        const changed: RoleAclDraft = { secObjId: 1, permissions: ['ROLE_EDIT_ROLE'] };
        const added: RoleAclDraft = { secObjId: 11, permissions: ['CHANNEL_CREATE_MESSAGE'] };

        expect(diffRoleAcls(initial, [changed, added])).toEqual({ upserts: [changed, added], deletes: [2] });
    });
});
