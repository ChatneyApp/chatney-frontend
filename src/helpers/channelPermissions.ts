import type { Permission } from '../graphql/generated/graphql';

// DM channels have no workspace or channel type to inherit from, so they get a fixed set
export const DM_CHANNEL_PERMISSIONS: readonly Permission[] = [
    'ATTACHMENT_DELETE',
    'ATTACHMENT_READ',
    'ATTACHMENT_UPLOAD',
    'CHANNEL_ADD_CHANNEL_GROUP',
    'CHANNEL_CREATE_MESSAGE',
    'CHANNEL_DELETE_OWN_MESSAGE',
    'CHANNEL_EDIT_OWN_MESSAGE',
    'CHANNEL_READ_CHANNEL',
    'CHANNEL_READ_MESSAGE',
];

export type ChannelPermissions = {
    canPost: boolean;
    canEditOwn: boolean;
    canDeleteOwn: boolean;
    canDeleteAny: boolean;
};

export const toChannelPermissions = (permissions: readonly Permission[]): ChannelPermissions => ({
    canPost: permissions.includes('CHANNEL_CREATE_MESSAGE'),
    canEditOwn: permissions.includes('CHANNEL_EDIT_OWN_MESSAGE'),
    canDeleteOwn: permissions.includes('CHANNEL_DELETE_OWN_MESSAGE'),
    canDeleteAny: permissions.includes('CHANNEL_DELETE_MESSAGE'),
});

export const canEditMessage = (permissions: ChannelPermissions, isMine: boolean) =>
    isMine && permissions.canEditOwn;

export const canDeleteMessage = (permissions: ChannelPermissions, isMine: boolean) =>
    permissions.canDeleteAny || (isMine && permissions.canDeleteOwn);
