import { Workspace } from "./workspaces";

export type UserAuthorization = {
    Id: string;
    Token: string;
}
export type User = {
    id: string;
    name: string;
    active: boolean;
    verified: boolean;
    banned: boolean;
    muted: boolean;
    email: string;
    workspaces: Workspace[];
}
