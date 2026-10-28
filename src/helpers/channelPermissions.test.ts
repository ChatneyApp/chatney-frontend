import {
    canDeleteMessage,
    canEditMessage,
    DM_CHANNEL_PERMISSIONS,
    toChannelPermissions,
} from './channelPermissions';

describe('toChannelPermissions', () => {
    it('allows posting, threads, editing and deleting own messages, attachments and reactions in DMs', () => {
        expect(toChannelPermissions(DM_CHANNEL_PERMISSIONS)).toEqual({
            canPost: true,
            canCreateThread: true,
            canEditOwn: true,
            canDeleteOwn: true,
            canDeleteAny: false,
            canUploadAttachments: true,
            canDeleteAttachments: true,
            canAddReactions: true,
            canRemoveReactions: true,
        });
    });

    it('allows nothing without permissions', () => {
        expect(toChannelPermissions([])).toEqual({
            canPost: false,
            canCreateThread: false,
            canEditOwn: false,
            canDeleteOwn: false,
            canDeleteAny: false,
            canUploadAttachments: false,
            canDeleteAttachments: false,
            canAddReactions: false,
            canRemoveReactions: false,
        });
    });
});

describe('canEditMessage', () => {
    it.each([
        [['CHANNEL_EDIT_OWN_MESSAGE'], true, true],
        [['CHANNEL_EDIT_OWN_MESSAGE'], false, false],
        [['CHANNEL_EDIT_MESSAGE'], true, false],
        [[], true, false],
    ] as const)('with %j on own=%s returns %s', (permissions, isMine, expected) => {
        expect(canEditMessage(toChannelPermissions(permissions), isMine)).toBe(expected);
    });
});

describe('canDeleteMessage', () => {
    it.each([
        [['CHANNEL_DELETE_OWN_MESSAGE'], true, true],
        [['CHANNEL_DELETE_OWN_MESSAGE'], false, false],
        [['CHANNEL_DELETE_MESSAGE'], true, true],
        [['CHANNEL_DELETE_MESSAGE'], false, true],
        [[], true, false],
    ] as const)('with %j on own=%s returns %s', (permissions, isMine, expected) => {
        expect(canDeleteMessage(toChannelPermissions(permissions), isMine)).toBe(expected);
    });
});
