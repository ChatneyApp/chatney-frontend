export type RoleId = number;
export type Role = {
    id: RoleId;
    name: string;
    isProtected: boolean;
    permissions: string[];
    createdAt?: string;
    updatedAt?: string;
}
