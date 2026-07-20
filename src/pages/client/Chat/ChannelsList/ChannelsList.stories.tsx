import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ChannelList } from './ChannelsList';
import { withWorkspacesList } from '@/test-utils/decorators/withWorkspacesList';
import { mockChannel1, mockChannelsList } from '@/test-utils/fixtures/channels';

/** Opening "+ Create channel" mounts CreateChannelModal, which needs its own GraphQL/context mocks — see STORYBOOK_COVERAGE.md. */
const meta: Meta<typeof ChannelList> = {
    title: 'pages/client/Chat/ChannelsList',
    component: ChannelList,
    decorators: [withWorkspacesList()],
};
export default meta;

type Story = StoryObj<typeof ChannelList>;

/** A channel list with one active channel selected. */
export const Default: Story = {
    args: {
        channels: mockChannelsList,
        activeChannel: mockChannel1,
        setActiveChannel: action('setActiveChannel'),
        refetch: action('refetch'),
    },
};

/** No channels yet in this workspace. */
export const Empty: Story = {
    args: {
        channels: [],
        activeChannel: null,
        setActiveChannel: action('setActiveChannel'),
        refetch: action('refetch'),
    },
};
