import type { Decorator } from '@storybook/react-vite';
import { WorkspaceChannelsListContext } from '@/contexts/WorkspaceChannelsListContext';
import { mockChannelsList } from '@/test-utils/fixtures/channels';

const defaultValue = {
    channels: mockChannelsList,
};

/** Supplies a static WorkspaceChannelsListContext value instead of the real provider, which fetches over Apollo on mount. */
export const withWorkspaceChannelsList = (value = defaultValue): Decorator => (Story) => (
    <WorkspaceChannelsListContext.Provider value={value}>
        <Story />
    </WorkspaceChannelsListContext.Provider>
);
