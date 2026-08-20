import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ChannelList } from './ChannelsList';
import { withWorkspacesList } from '@/test-utils/decorators/withWorkspacesList';
import { mockChannel1, mockChannelsList, mockDirectMessage } from '@/test-utils/fixtures/channels';

/** Opening "+ Create channel" mounts CreateChannelModal, which needs its own GraphQL/context mocks — see STORYBOOK_COVERAGE.md. */
const meta: Meta<typeof ChannelList> = {
    title: 'pages/client/Chat/ChannelsList',
    component: ChannelList,
    decorators: [withWorkspacesList()],
};
export default meta;

type Story = StoryObj<typeof ChannelList>;

const sharedArgs = {
    setActiveChannel: action('setActiveChannel'),
    onComposeDirectMessage: action('onComposeDirectMessage'),
    refetchChannels: action('refetchChannels'),
    isComposingDirectMessage: false,
};

/** A channel list with one active channel selected. */
export const Default: Story = {
    args: {
        ...sharedArgs,
        channels: mockChannelsList,
        directMessages: [mockDirectMessage],
        activeChannel: mockChannel1,
    },
};

/** No channels yet in this workspace. */
export const Empty: Story = {
    args: {
        ...sharedArgs,
        channels: [],
        directMessages: [],
        activeChannel: null,
    },
};

/** Composing a new direct message highlights "+ New message" instead of a channel. */
export const ComposingDirectMessage: Story = {
    args: {
        ...sharedArgs,
        channels: mockChannelsList,
        directMessages: [mockDirectMessage],
        activeChannel: null,
        isComposingDirectMessage: true,
    },
};
