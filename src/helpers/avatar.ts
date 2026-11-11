// Same storage origin as the attachment URLs (see MessageAttachmentComponent).
const STORAGE_URL = 'http://localhost:9000/chatney';

/**
 * Turns `User.avatarUrl` into something usable as an image `src`.
 * Uploaded avatars are stored as a storage path ("/avatars/{userId}.{ext}"); anything else is already a full URL.
 */
export function getAvatarSrc(avatarUrl: string | null | undefined): string | null {
    if (!avatarUrl) {
        return null;
    }
    if (!avatarUrl.startsWith('/')) {
        return avatarUrl;
    }

    const version = avatarVersions.get(avatarUrl);
    return `${STORAGE_URL}${avatarUrl}${version ? `?v=${version}` : ''}`;
}

// A re-uploaded avatar keeps its storage path, so the browser would keep showing the cached image.
const avatarVersions = new Map<string, number>();

/** Call when an avatar is known to have changed: makes getAvatarSrc return a fresh URL for it. */
export function markAvatarChanged(avatarUrl: string | null | undefined) {
    if (avatarUrl) {
        avatarVersions.set(avatarUrl, Date.now());
    }
}
