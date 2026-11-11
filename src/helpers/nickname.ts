import type { TFunction } from 'i18next';

export const NICKNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const MAX_NICKNAME_LENGTH = 20;

export function validateNickname(value: string, t: TFunction): string | true {
    const trimmed = value.trim();
    if (!trimmed) {
        return t('validation.nicknameRequired');
    }
    if (trimmed.length > MAX_NICKNAME_LENGTH) {
        return t('validation.nicknameTooLong', { count: MAX_NICKNAME_LENGTH });
    }
    if (!NICKNAME_PATTERN.test(trimmed)) {
        return t('validation.nicknameInvalid');
    }
    return true;
}

export function getUserDisplayName(user: { fullName?: string | null; nickname: string }): string {
    return user.fullName?.trim() || user.nickname;
}

/** Up to two capital letters for an avatar without an image: the first letters of the first two words of the name. */
export function getUserInitials(user: { fullName?: string | null; nickname: string }): string {
    return getUserDisplayName(user)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => Array.from(word)[0].toLocaleUpperCase())
        .join('');
}

export function getUserAvatarInitial(user: { fullName?: string | null; nickname: string }): string {
    const displayName = getUserDisplayName(user);
    return displayName.charAt(0).toUpperCase();
}
