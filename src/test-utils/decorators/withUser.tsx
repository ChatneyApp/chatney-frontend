import type { Decorator } from '@storybook/react-vite';
import { UserContext, UserContextData } from '@/contexts/UserContext';
import { mockUser1 } from '@/test-utils/fixtures/users';

const defaultUserContextValue: UserContextData = {
    user: mockUser1,
    logout: () => {},
};

/** Supplies a static UserContext value instead of the real UserProvider, which fetches over Apollo and redirects on mount. */
export const withUser = (value: UserContextData = defaultUserContextValue): Decorator => (Story) => (
    <UserContext.Provider value={value}>
        <Story />
    </UserContext.Provider>
);
