import { ChannelId } from '@/types/channels';

export type ChannelGroupId = number;
export type ChannelGroup = {
    id: ChannelGroupId;
    name: string;
    channelIds: ChannelId[];
    workspaceId: string;
    order: number;
}
