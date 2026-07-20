import { User, UserId } from '@/types/users';
import { MessageUser } from '@/types/messages';

export const mockUserId1: UserId = 'user-1';
export const mockUserId2: UserId = 'user-2';

export const mockUser1: User = {
    id: mockUserId1,
    name: 'Ada Lovelace',
    active: true,
    verified: true,
    banned: false,
    muted: false,
    email: 'ada@chatney.dev',
    workspaces: [],
};

export const mockUser2: User = {
    id: mockUserId2,
    name: 'Grace Hopper',
    active: true,
    verified: true,
    banned: false,
    muted: false,
    email: 'grace@chatney.dev',
    workspaces: [],
};

export const mockMessageUser1: MessageUser = {
    id: mockUserId1,
    name: mockUser1.name,
    avatarUrl: `https://i.pravatar.cc/150?u=${mockUserId1}`,
};

export const mockMessageUser2: MessageUser = {
    id: mockUserId2,
    name: mockUser2.name,
    avatarUrl: `https://i.pravatar.cc/150?u=${mockUserId2}`,
};
