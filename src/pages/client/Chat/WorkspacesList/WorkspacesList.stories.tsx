import type { Meta, StoryObj } from '@storybook/react-vite';
import { MockedProvider } from '@apollo/client/testing/react';
import { AddWorkspaceMutation } from '@/graphql/workspaces';
import { withWorkspacesList } from '@/test-utils/decorators/withWorkspacesList';
import { withUser } from '@/test-utils/decorators/withUser';
import { WorkspacesList } from './WorkspacesList';

const mocks = [
    {
        request: { query: AddWorkspaceMutation, variables: { name: 'New Team' } },
        result: {
            data: {
                workspaces: {
                    addWorkspace: { id: 3, name: 'New Team', secObjId: 3, createdAt: '2026-01-15T10:00:00Z', updatedAt: '2026-01-15T10:00:00Z' },
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
