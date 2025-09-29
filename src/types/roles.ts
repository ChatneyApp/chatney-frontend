export type RoleId = string;
export type Role = {
    id: RoleId;
    name: string;
    permissions: [];
    settings: {
        base: boolean;
    };
}
