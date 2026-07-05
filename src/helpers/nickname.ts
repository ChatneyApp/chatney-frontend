export const NICKNAME_PATTERN = /^[a-zA-Z0-9_]+$/;
export const MAX_NICKNAME_LENGTH = 20;

export function validateNickname(value: string): string | true {
    const trimmed = value.trim();
    if (!trimmed) {
        return 'Nickname is required';
    }
    if (trimmed.length > MAX_NICKNAME_LENGTH) {
        return `Nickname must be at most ${MAX_NICKNAME_LENGTH} characters`;
    }
    if (!NICKNAME_PATTERN.test(trimmed)) {
        return 'Nickname can only contain letters, numbers, and underscores';
    }
    return true;
}

export function getUserDisplayName(user: { fullName?: string | null; nickname: string }): string {
    return user.fullName?.trim() || user.nickname;
}

export function getUserAvatarInitial(user: { fullName?: string | null; nickname: string }): string {
    const displayName = getUserDisplayName(user);
    return displayName.charAt(0).toUpperCase();
}
