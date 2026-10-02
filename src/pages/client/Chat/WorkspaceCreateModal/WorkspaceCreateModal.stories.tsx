import type { Meta, StoryObj } from '@storybook/react-vite';
import { MockedProvider } from '@apollo/client/testing/react';
import { AddWorkspaceMutation } from '@/graphql/workspaces';
import { action } from 'storybook/actions';
import { WorkspaceCreateModal } from './WorkspaceCreateModal';

const mocks = [
    {
        request: { query: AddWorkspaceMutation, variables: { name: 'Design Team' } },
        result: {
            data: {
                workspaces: {
                    addWorkspace: { id: 3, name: 'Design Team', secObjId: 3, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
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
