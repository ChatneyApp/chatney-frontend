import type { Decorator } from '@storybook/react-vite';
import { WorkspaceChannelsListContext } from '@/contexts/WorkspaceChannelsListContext';
import { mockChannel1, mockChannelsList } from '@/test-utils/fixtures/channels';

const defaultValue = {
    channels: mockChannelsList,
    activeChannel: mockChannel1,
    refetch: () => {},
    setActiveChannel: () => {},
};

/** Supplies a static WorkspaceChannelsListContext value instead of the real provider, which fetches over Apollo on mount. */
export const withWorkspaceChannelsList = (value = defaultValue): Decorator => (Story) => (
    <WorkspaceChannelsListContext.Provider value={value}>
        <Story />
    </WorkspaceChannelsListContext.Provider>
);
