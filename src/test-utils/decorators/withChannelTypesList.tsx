import type { Decorator } from '@storybook/react-vite';
import { ChannelTypesListContext } from '@/contexts/ChannelTypesListContext';
import { mockChannelTypesList } from '@/test-utils/fixtures/channelTypes';

const defaultValue = {
    channelTypes: mockChannelTypesList,
    refetch: () => {},
};

/** Supplies a static ChannelTypesListContext value, bypassing the real provider's useSuspenseQuery. */
export const withChannelTypesList = (value = defaultValue): Decorator => (Story) => (
    <ChannelTypesListContext.Provider value={value}>
        <Story />
    </ChannelTypesListContext.Provider>
);
