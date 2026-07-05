export type UserId = string;
export type UserAuthorization = {
    id: UserId;
    token: string;
}
export type User = {
    id: UserId;
    name: string;
    active: boolean;
    verified: boolean;
    banned: boolean;
    muted: boolean;
    email: string;
    avatarUrl?: string | null;
    roleId?: number;
}
