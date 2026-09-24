import { User, UserId } from '@/types/users';
import { MessageUser } from '@/types/messages';

export const mockUserId1: UserId = 'user-1';
export const mockUserId2: UserId = 'user-2';

export const mockUser1: User = {
    id: mockUserId1,
    nickname: 'ada',
    fullName: 'Ada Lovelace',
    active: true,
    verified: true,
    banned: false,
    muted: false,
    email: 'ada@chatney.dev',
};

export const mockUser2: User = {
    id: mockUserId2,
    nickname: 'grace',
    fullName: 'Grace Hopper',
    active: true,
    verified: true,
    banned: false,
    muted: false,
    email: 'grace@chatney.dev',
};

export const mockMessageUser1: MessageUser = {
    id: mockUserId1,
    nickname: mockUser1.nickname,
    fullName: mockUser1.fullName,
    displayName: 'Ada Lovelace',
    avatarUrl: `https://i.pravatar.cc/150?u=${mockUserId1}`,
};

export const mockMessageUser2: MessageUser = {
    id: mockUserId2,
    nickname: mockUser2.nickname,
    fullName: mockUser2.fullName,
    displayName: 'Grace Hopper',
    avatarUrl: `https://i.pravatar.cc/150?u=${mockUserId2}`,
};
