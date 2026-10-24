import { getFirstChannel, GroupedChannels, groupChannels } from './channelGroups';

const channel = (id: number) => ({ id, name: `channel ${id}` });
const group = (id: number, order: number, channelIds: number[]) => ({ id, order, channelIds, name: `group ${id}` });

const summarize = (result: GroupedChannels<{ id: number }, { id: number }>) => ({
    groups: result.groups.map(section => [section.group.id, section.channels.map(listed => listed.id)]),
    ungrouped: result.ungrouped.map(listed => listed.id),
});

describe('groupChannels', () => {
    it('puts grouped channels into their groups and the rest after them', () => {
        const result = groupChannels(
            [channel(1), channel(2), channel(3), channel(4), channel(5)],
            [group(1, 0, [1, 2]), group(2, 1, [3, 4])],
        );

        expect(summarize(result)).toEqual({ groups: [[1, [1, 2]], [2, [3, 4]]], ungrouped: [5] });
    });

    it('orders groups by `order`, then by id', () => {
        const result = groupChannels(
            [channel(1), channel(2), channel(3)],
            [group(1, 5, [1]), group(2, 0, [2]), group(3, 0, [3])],
        );

        expect(summarize(result).groups.map(([id]) => id)).toEqual([2, 3, 1]);
    });

    it('orders channels by id inside groups and among the ungrouped', () => {
        const result = groupChannels(
            [channel(6), channel(3), channel(5), channel(1), channel(4)],
            [group(1, 0, [5, 1, 3])],
        );

        expect(summarize(result)).toEqual({ groups: [[1, [1, 3, 5]]], ungrouped: [4, 6] });
    });

    it('leaves out groups without visible channels', () => {
        const result = groupChannels(
            [channel(1), channel(2)],
            [group(1, 0, [7, 8]), group(2, 1, []), group(3, 2, [2, 9])],
        );

        expect(summarize(result)).toEqual({ groups: [[3, [2]]], ungrouped: [1] });
    });

    it('shows a channel listed in several groups only in the first one', () => {
        const result = groupChannels(
            [channel(1), channel(2)],
            [group(1, 1, [1, 2]), group(2, 0, [1])],
        );

        expect(summarize(result)).toEqual({ groups: [[2, [1]], [1, [2]]], ungrouped: [] });
    });

    it('returns every channel as ungrouped when there are no groups', () => {
        expect(summarize(groupChannels([channel(2), channel(1)], []))).toEqual({ groups: [], ungrouped: [1, 2] });
    });
});

describe('getFirstChannel', () => {
    it('returns the first channel of the first shown group', () => {
        const result = groupChannels(
            [channel(1), channel(2), channel(3)],
            [group(1, 1, [1]), group(2, 0, [3, 2]), group(3, -1, [99])],
        );

        expect(getFirstChannel(result)?.id).toBe(2);
    });

    it('falls back to the first ungrouped channel', () => {
        expect(getFirstChannel(groupChannels([channel(4), channel(3)], [group(1, 0, [99])]))?.id).toBe(3);
    });

    it('returns undefined when there are no channels', () => {
        expect(getFirstChannel(groupChannels([], [group(1, 0, [1])]))).toBeUndefined();
    });
});
