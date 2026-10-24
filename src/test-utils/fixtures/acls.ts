import { PermissionGroup, SecureObjectList } from '@/types/acls';
import { globalSecObjId } from '@/infra/consts';
import { RoleAclDraft } from '@/helpers/roleAcls';
import { SecureObjectEntry } from '@/pages/admin/roles/components/secureObjects';

import { mockWorkspace1, mockWorkspace2, mockWorkspacesList } from './workspaces';
import { mockChannelType1, mockChannelTypesList } from './channelTypes';
import { mockChannel1, mockChannelsList } from './channels';

export const mockSecureObjectList: SecureObjectList = {
    workspaces: mockWorkspacesList,
    channelTypes: mockChannelTypesList,
    channels: mockChannelsList,
};

// What listSecureObjects builds from mockSecureObjectList with the English locale.
export const mockSecureObjectEntries: SecureObjectEntry[] = [
    { secObjId: globalSecObjId, kind: 'global', id: null, name: 'Global (system-wide)' },
    ...mockWorkspacesList.map((workspace): SecureObjectEntry => ({
        secObjId: workspace.secObjId,
        kind: 'workspace',
        id: workspace.id,
        name: workspace.name,
    })),
    ...mockChannelTypesList.map((channelType): SecureObjectEntry => ({
        secObjId: channelType.secObjId,
        kind: 'channelType',
        id: channelType.id,
        name: channelType.name,
    })),
    ...mockChannelsList.map((channel): SecureObjectEntry => ({
        secObjId: channel.secObjId,
        kind: 'channel',
        id: channel.id,
        name: `${mockWorkspace1.name} / #${channel.name}`,
        workspaceId: channel.workspaceId,
    })),
];

// Mirrors the backend's PermissionGroups.
export const mockPermissionGroups: PermissionGroup[] = [
    { label: 'System config permissions', list: ['CONFIG_READ_VALUE', 'CONFIG_UPDATE_VALUE'] },
    {
        label: 'Workspace permissions',
        list: ['WORKSPACE_CREATE_WORKSPACE', 'WORKSPACE_DELETE_WORKSPACE', 'WORKSPACE_READ_WORKSPACE', 'WORKSPACE_UPDATE_WORKSPACE'],
    },
    {
        label: 'Channel permissions',
        list: [
            'CHANNEL_ADD_CHANNEL_GROUP',
            'CHANNEL_CREATE_CHANNEL',
            'CHANNEL_CREATE_MESSAGE',
            'CHANNEL_DELETE_CHANNEL',
            'CHANNEL_DELETE_CHANNEL_GROUP',
            'CHANNEL_DELETE_CHANNEL_TYPE',
            'CHANNEL_DELETE_MESSAGE',
            'CHANNEL_DELETE_OWN_MESSAGE',
            'CHANNEL_EDIT_CHANNEL',
            'CHANNEL_EDIT_CHANNEL_GROUP',
            'CHANNEL_EDIT_MESSAGE',
            'CHANNEL_EDIT_OWN_MESSAGE',
            'CHANNEL_READ_CHANNEL',
            'CHANNEL_READ_MESSAGE',
        ],
    },
    { label: 'User permissions', list: ['USER_CREATE_USER', 'USER_DELETE_USER', 'USER_EDIT_USER', 'USER_READ_USER'] },
    { label: 'Role permissions', list: ['ROLE_CREATE_ROLE', 'ROLE_DELETE_ROLE', 'ROLE_EDIT_ROLE', 'ROLE_READ_ROLE'] },
    { label: 'Attachment permissions', list: ['ATTACHMENT_DELETE', 'ATTACHMENT_READ', 'ATTACHMENT_UPLOAD'] },
];

export const mockRoleAclDrafts: RoleAclDraft[] = [
    { secObjId: globalSecObjId, permissions: ['ATTACHMENT_READ', 'ATTACHMENT_UPLOAD', 'USER_READ_USER'] },
    { secObjId: mockWorkspace2.secObjId, permissions: ['WORKSPACE_READ_WORKSPACE', 'CHANNEL_READ_CHANNEL', 'CHANNEL_READ_MESSAGE'] },
    { secObjId: mockChannelType1.secObjId, permissions: ['CHANNEL_CREATE_MESSAGE'] },
    { secObjId: mockChannel1.secObjId, permissions: ['CHANNEL_DELETE_MESSAGE', 'CHANNEL_EDIT_MESSAGE'] },
];
