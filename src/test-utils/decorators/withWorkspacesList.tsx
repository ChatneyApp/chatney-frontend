import type { Decorator } from '@storybook/react-vite';
import { WorkspacesListContext } from '@/contexts/WorkspacesListContext';
import { mockWorkspace1, mockWorkspacesList } from '@/test-utils/fixtures/workspaces';

const defaultValue = {
    workspacesList: mockWorkspacesList,
    setWorkspacesList: () => {},
    activeWorkspaceId: mockWorkspace1.id,
    setActiveWorkspaceId: () => {},
    refetch: () => {},
};

/** Supplies a static WorkspacesListContext value instead of the real provider, which fetches over Apollo on mount. */
export const withWorkspacesList = (value = defaultValue): Decorator => (Story) => (
    <WorkspacesListContext.Provider value={value}>
        <Story />
    </WorkspacesListContext.Provider>
);
