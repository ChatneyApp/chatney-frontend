import { Channel } from '@/types/channels';
import { ChannelListItem } from '@/pages/client/Chat/types';
import { mockWorkspace1 } from './workspaces';
import { mockChannelType1 } from './channelTypes';

export const mockChannel1: Channel = {
    id: 1,
    name: 'general',
    channelTypeId: mockChannelType1.id,
    workspaceId: mockWorkspace1.id,
    isDm: false,
    secObjId: 21,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
};

export const mockChannel2: Channel = {
    id: 2,
    name: 'random',
    channelTypeId: mockChannelType1.id,
    workspaceId: mockWorkspace1.id,
    isDm: false,
    secObjId: 22,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
};

export const mockDirectMessageUser = {
    id: 'user-2',
    nickname: 'grace',
    avatarUrl: null,
};

export const mockDirectMessage: Channel = {
    id: 10,
    name: 'Direct message',
    channelTypeId: 3,
    workspaceId: null,
    isDm: true,
    secObjId: 30,
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-01-15T10:00:00Z',
    otherUsers: [mockDirectMessageUser],
};

export const mockChannelsList: Channel[] = [mockChannel1, mockChannel2];

export const mockChannelListItem1: ChannelListItem = { id: mockChannel1.id, name: mockChannel1.name };
