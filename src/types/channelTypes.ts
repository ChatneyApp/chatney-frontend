import { RoleId } from '@/types/roles';

export type ChannelTypeId = number;
export type ChannelType = {
    id: ChannelTypeId;
    label: string;
    key: string;
    baseRoleId: RoleId;
} 
