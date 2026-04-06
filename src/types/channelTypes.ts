import { RoleId } from '@/types/roles';

export type ChannelTypeId = number;
export type ChannelType = {
    id: ChannelTypeId;
    name: string;
    key: string;
    baseRoleId: RoleId;
} 
