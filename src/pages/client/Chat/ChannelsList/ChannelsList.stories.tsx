import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ChannelList } from './ChannelsList';
import { withWorkspacesList } from '@/test-utils/decorators/withWorkspacesList';
import { mockChannel1, mockChannelsList, mockDirectMessage } from '@/test-utils/fixtures/channels';
import { mockChannelGroup1, mockHiddenChannelGroup } from '@/test-utils/fixtures/channelGroups';
import { groupChannels } from '@/helpers/channelGroups';

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
    isComposingDirectMessage: false,
};

/** A channel list with one active channel selected. */
export const Default: Story = {
    args: {
        ...sharedArgs,
        groupedChannels: groupChannels(mockChannelsList, []),
        directMessages: [mockDirectMessage],
        activeChannel: mockChannel1,
    },
};

/** Grouped channels come first, under their group's name; ungrouped ones follow. A group with no visible channels is left out. */
export const Grouped: Story = {
    args: {
        ...sharedArgs,
        groupedChannels: groupChannels(mockChannelsList, [mockChannelGroup1, mockHiddenChannelGroup]),
        directMessages: [mockDirectMessage],
        activeChannel: mockChannel1,
    },
};

/** No channels yet in this workspace. */
export const Empty: Story = {
    args: {
        ...sharedArgs,
        groupedChannels: groupChannels([], []),
        directMessages: [],
        activeChannel: null,
    },
};

/** Composing a new direct message highlights "+ New message" instead of a channel. */
export const ComposingDirectMessage: Story = {
    args: {
        ...sharedArgs,
        groupedChannels: groupChannels(mockChannelsList, []),
        directMessages: [mockDirectMessage],
        activeChannel: null,
        isComposingDirectMessage: true,
    },
};
