export type ChannelGroupId = number;
export type ChannelGroup = {
    id: ChannelGroupId;
    name: string;
    channelIds: string[];
    workspace: string;
    order: number;
}
