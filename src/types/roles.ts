export type RoleId = number;
export type Role = {
    id: RoleId;
    name: string;
    permissions: [];
    settings: {
        protected: boolean;
    };
}
