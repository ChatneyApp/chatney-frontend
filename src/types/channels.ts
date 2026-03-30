import { ChannelTypeId } from '@/types/channelTypes';
import { WorkspaceId } from '@/types/workspaces';

export type ChannelId = number;
export type Channel = {
    id: ChannelId;
    name: string;
    channelTypeId: ChannelTypeId;
    workspaceId: WorkspaceId;
}
