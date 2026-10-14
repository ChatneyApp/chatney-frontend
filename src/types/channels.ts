import type { ChannelFieldsFragment, DirectMessageUserFieldsFragment } from '@/graphql/generated/graphql';

export type ChannelId = number;

export type DirectMessageUser = DirectMessageUserFieldsFragment;

export type Channel = ChannelFieldsFragment & {
    otherUsers?: DirectMessageUser[];
};

export function channelDisplayName(channel: Channel): string {
    if (channel.otherUsers && channel.otherUsers.length > 0) {
        return channel.otherUsers.map(user => user.nickname).join(', ');
    }

    return channel.name;
}
