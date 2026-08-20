import { ChannelTypeId } from '@/types/channelTypes';
import { UserId } from '@/types/users';
import { WorkspaceId } from '@/types/workspaces';

export type ChannelId = number;

export type DirectMessageUser = {
    id: UserId;
    nickname: string;
    avatarUrl?: string | null;
};

export type Channel = {
    id: ChannelId;
    name: string;
    channelTypeId: ChannelTypeId;
    workspaceId: WorkspaceId | null;
    isDm?: boolean;
    otherUsers?: DirectMessageUser[];
};

export function channelDisplayName(channel: Channel): string {
    if (channel.otherUsers && channel.otherUsers.length > 0) {
        return channel.otherUsers.map(user => user.nickname).join(', ');
    }

    return channel.name;
}
