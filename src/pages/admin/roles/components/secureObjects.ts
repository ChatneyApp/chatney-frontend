import type { TFunction } from 'i18next';

import { globalSecObjId } from '@/infra/consts';
import { SecureObjectList } from '@/types/acls';
import { RoleAclDraft } from '@/helpers/roleAcls';

export type SecureObjectKind = 'global' | 'workspace' | 'channelType' | 'channel';

export type SecureObjectEntry = {
    secObjId: number;
    kind: SecureObjectKind;
    // Domain id of the workspace, channel type or channel; null for global.
    id: number | null;
    name: string;
    // Owning workspace of a channel, for grouping channels in the picker.
    workspaceId?: number | null;
};

/** Every object a role ACL can target, in display order: global, workspaces, channel types, channels. */
export function listSecureObjects(secureObjects: SecureObjectList, t: TFunction): SecureObjectEntry[] {
    const workspaceNames = new Map(secureObjects.workspaces.map((workspace) => [workspace.id, workspace.name]));

    return [
        { secObjId: globalSecObjId, kind: 'global', id: null, name: t('admin.roles.permissionsBlock.global') },
        ...secureObjects.workspaces.map((workspace): SecureObjectEntry => ({
            secObjId: workspace.secObjId,
            kind: 'workspace',
            id: workspace.id,
            name: workspace.name,
        })),
        ...secureObjects.channelTypes.map((channelType): SecureObjectEntry => ({
            secObjId: channelType.secObjId,
            kind: 'channelType',
            id: channelType.id,
            name: channelType.name,
        })),
        ...secureObjects.channels.map((channel): SecureObjectEntry => {
            const workspaceName = channel.workspaceId == null ? undefined : workspaceNames.get(channel.workspaceId);

            return {
                secObjId: channel.secObjId,
                kind: 'channel',
                id: channel.id,
                name: workspaceName
                    ? t('admin.roles.permissionsBlock.channelName', { workspace: workspaceName, channel: channel.name })
                    : `#${channel.name}`,
                workspaceId: channel.workspaceId,
            };
        }),
    ];
}

/** Orders ACLs like the picker lists their objects; ACLs on unknown objects go last. */
export function sortRoleAclDrafts(acls: RoleAclDraft[], entries: SecureObjectEntry[]): RoleAclDraft[] {
    const position = new Map(entries.map((entry, index) => [entry.secObjId, index]));

    return [...acls].sort((a, b) =>
        (position.get(a.secObjId) ?? entries.length) - (position.get(b.secObjId) ?? entries.length)
        || a.secObjId - b.secObjId);
}
