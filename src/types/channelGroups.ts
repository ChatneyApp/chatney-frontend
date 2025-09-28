export type ChannelGroupId = string;
export type ChannelGroup = {
    id: ChannelGroupId;
    name: string;
    channelIds: string[];
    workspace: string;
    order: number;
}
