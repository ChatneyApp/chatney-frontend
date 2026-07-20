import type { Meta, StoryObj } from '@storybook/react-vite';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { action } from 'storybook/actions';
import { WorkspaceCreateModal } from './WorkspaceCreateModal';

const ADD_WORKSPACE_MUTATION = gql`
    mutation AddWorkspace($name: String!) {
        workspaces {
            addWorkspace(workspaceDto: { name: $name }) {
                id
                name
                createdAt
                updatedAt
            }
        }
    }
`;

const mocks = [
    {
        request: { query: ADD_WORKSPACE_MUTATION, variables: { name: 'Design Team' } },
        result: {
            data: {
                workspaces: {
                    addWorkspace: { id: 3, name: 'Design Team', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
                },
            },
        },
    },
];

/** Only the form/submit path is Apollo-driven; the story wraps in MockedProvider so a real submit ("Design Team") resolves without hitting a network. */
const meta: Meta<typeof WorkspaceCreateModal> = {
    title: 'pages/client/Chat/WorkspaceCreateModal',
    component: WorkspaceCreateModal,
    decorators: [(Story) => (
        <MockedProvider mocks={mocks}>
            <Story />
        </MockedProvider>
    )],
};
export default meta;

type Story = StoryObj<typeof WorkspaceCreateModal>;

/** The create-workspace dialog, ready for input. */
export const Default: Story = {
    args: {
        onClose: action('onClose'),
        onWorkspaceCreated: action('onWorkspaceCreated'),
    },
};
