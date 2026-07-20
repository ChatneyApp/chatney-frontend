import type { Meta, StoryObj } from '@storybook/react-vite';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { action } from 'storybook/actions';
import { CreateChannelModal } from './CreateChannelModal';
import { withWorkspacesList } from '@/test-utils/decorators/withWorkspacesList';
import { withChannelTypesList } from '@/test-utils/decorators/withChannelTypesList';

const ADD_CHANNEL_MUTATION = gql`
    mutation AddChannel($name: String!, $channelTypeId: Int!, $workspaceId: Int!) {
        channels {
            addChannel(channelDto: { name: $name, channelTypeId: $channelTypeId, workspaceId: $workspaceId }) {
                id
                name
                channelTypeId
                workspaceId
                createdAt
                updatedAt
            }
        }
    }
`;

const mocks = [
    {
        request: { query: ADD_CHANNEL_MUTATION, variables: { name: 'announcements', channelTypeId: 1, workspaceId: 1 } },
        result: {
            data: {
                channels: {
                    addChannel: {
                        id: 3,
                        name: 'announcements',
                        channelTypeId: 1,
                        workspaceId: 1,
                        createdAt: '2026-01-15T10:00:00Z',
                        updatedAt: '2026-01-15T10:00:00Z',
                    },
                },
            },
        },
    },
];

/** Needs both WorkspacesListContext (for the active workspace) and ChannelTypesListContext (for the type dropdown) plus a live Apollo mutation on submit — composed here via decorators + MockedProvider. */
const meta: Meta<typeof CreateChannelModal> = {
    title: 'pages/client/Chat/CreateChannelModal',
    component: CreateChannelModal,
    decorators: [
        withWorkspacesList(),
        withChannelTypesList(),
        (Story) => (
            <MockedProvider mocks={mocks}>
                <Story />
            </MockedProvider>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof CreateChannelModal>;

/** The create-channel dialog, showing the channel-type dropdown populated from context. */
export const Default: Story = {
    args: {
        onClose: action('onClose'),
        onChannelCreated: action('onChannelCreated'),
    },
};
