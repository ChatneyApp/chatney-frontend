import type { Meta, StoryObj } from '@storybook/react-vite';
import { gql } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing/react';
import { withWorkspacesList } from '@/test-utils/decorators/withWorkspacesList';
import { withUser } from '@/test-utils/decorators/withUser';
import { WorkspacesList } from './WorkspacesList';

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
        request: { query: ADD_WORKSPACE_MUTATION, variables: { name: 'New Team' } },
        result: {
            data: {
                workspaces: {
                    addWorkspace: { id: 3, name: 'New Team', createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
                },
            },
        },
    },
];

/** Fully context-driven (no props). Composes the WorkspacesList + UserContext decorators plus a MockedProvider so opening "+" (WorkspaceCreateModal) and submitting "New Team" also works end to end. */
const meta: Meta<typeof WorkspacesList> = {
    title: 'pages/client/Chat/WorkspacesList',
    component: WorkspacesList,
    decorators: [
        withWorkspacesList(),
        withUser(),
        (Story) => (
            <MockedProvider mocks={mocks}>
                <Story />
            </MockedProvider>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof WorkspacesList>;

/** The workspace switcher with two workspaces and the current user's avatar. */
export const Default: Story = {
    args: {},
};
