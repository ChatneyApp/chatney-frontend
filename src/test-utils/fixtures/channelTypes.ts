import { ChannelType } from '@/types/channelTypes';

export const mockChannelType1: ChannelType = { id: 1, name: 'Public', key: 'public', baseRoleId: 1 };
export const mockChannelType2: ChannelType = { id: 2, name: 'Private', key: 'private', baseRoleId: 2 };

export const mockChannelTypesList: ChannelType[] = [mockChannelType1, mockChannelType2];
