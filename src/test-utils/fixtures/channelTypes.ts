import { ChannelType } from '@/types/channelTypes';

export const mockChannelType1: ChannelType = { id: 1, name: 'Public', key: 'public', secObjId: 11, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' };
export const mockChannelType2: ChannelType = { id: 2, name: 'Private', key: 'private', secObjId: 12, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' };

export const mockChannelTypesList: ChannelType[] = [mockChannelType1, mockChannelType2];
