import { Channel } from '@/types/channels';
import { ChannelListItem } from '@/pages/client/Chat/types';
import { mockWorkspace1 } from './workspaces';
import { mockChannelType1 } from './channelTypes';

export const mockChannel1: Channel = {
    id: 1,
    name: 'general',
    channelTypeId: mockChannelType1.id,
    workspaceId: mockWorkspace1.id,
};

export const mockChannel2: Channel = {
    id: 2,
    name: 'random',
    channelTypeId: mockChannelType1.id,
    workspaceId: mockWorkspace1.id,
};

export const mockChannelsList: Channel[] = [mockChannel1, mockChannel2];

export const mockChannelListItem1: ChannelListItem = { id: mockChannel1.id, name: mockChannel1.name };
