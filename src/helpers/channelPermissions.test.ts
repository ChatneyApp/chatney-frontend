import {
    canDeleteMessage,
    canEditMessage,
    DM_CHANNEL_PERMISSIONS,
    toChannelPermissions,
} from './channelPermissions';

describe('toChannelPermissions', () => {
    it('allows posting, editing and deleting own messages in DMs', () => {
        expect(toChannelPermissions(DM_CHANNEL_PERMISSIONS)).toEqual({
            canPost: true,
            canEditOwn: true,
            canDeleteOwn: true,
            canDeleteAny: false,
        });
    });

    it('allows nothing without permissions', () => {
        expect(toChannelPermissions([])).toEqual({
            canPost: false,
            canEditOwn: false,
            canDeleteOwn: false,
            canDeleteAny: false,
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
