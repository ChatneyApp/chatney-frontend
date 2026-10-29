import { ChannelGroup } from '@/types/channelGroups';
import { mockWorkspace1 } from './workspaces';
import { mockChannel1 } from './channels';

export const mockChannelGroup1: ChannelGroup = {
    id: 1,
    name: 'Team',
    workspaceId: mockWorkspace1.id,
    channelIds: [mockChannel1.id],
    order: 0,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
};

/** Holds only channels the viewer can't see, so the channel list leaves it out. */
export const mockHiddenChannelGroup: ChannelGroup = {
    id: 2,
    name: 'Leadership',
    workspaceId: mockWorkspace1.id,
    channelIds: [99],
    order: 1,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
};
