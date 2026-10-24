import { sortById } from './utils';

type GroupLike = { id: number; order: number; channelIds: readonly number[] };

export type ChannelGroupSection<Group, Channel> = {
    group: Group;
    channels: Channel[];
};

export type GroupedChannels<Group, Channel> = {
    groups: ChannelGroupSection<Group, Channel>[];
    ungrouped: Channel[];
};

/**
 * Splits the channels the user can see into their groups (by `order`) and the ungrouped rest, each sorted by id.
 * A group none of whose channels are visible is left out. A channel listed in several groups shows in the first.
 */
export const groupChannels = <Group extends GroupLike, Channel extends { id: number }>(
    channels: readonly Channel[],
    channelGroups: readonly Group[],
): GroupedChannels<Group, Channel> => {
    const sortedChannels = sortById(channels);
    const sortedGroups = [...channelGroups].sort((a, b) => a.order - b.order || a.id - b.id);
    const placedIds = new Set<number>();

    const groups = sortedGroups.flatMap((group) => {
        const memberIds = new Set(group.channelIds);
        const groupChannels = sortedChannels.filter(channel => memberIds.has(channel.id) && !placedIds.has(channel.id));
        groupChannels.forEach(channel => placedIds.add(channel.id));

        return groupChannels.length ? [{ group, channels: groupChannels }] : [];
    });

    return {
        groups,
        ungrouped: sortedChannels.filter(channel => !placedIds.has(channel.id)),
    };
};

/** The channel rendered first: the first one of the first group, or the first ungrouped one if no group is shown. */
export const getFirstChannel = <Channel>(groupedChannels: GroupedChannels<unknown, Channel>): Channel | undefined =>
    groupedChannels.groups[0]?.channels[0] ?? groupedChannels.ungrouped[0];
