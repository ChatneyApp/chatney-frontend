import { Suspense } from 'react';

import { WorkspaceEditor } from '@/pages/dashboard/components/WorkspaceEditor/WorkspaceEditor';
import { CreateWorkspaceForm } from '@/pages/dashboard/components/WorkspaceForm/CreateWorkspaceForm';
import { WorkspacesListProvider, useWorkspacesList } from '@/contexts/WorkspacesListContext';
import { EmptyListMessage } from '@/pages/dashboard/components/EmptyListMessage';

const WorkspacesListCore = () => {
    const { workspacesList } = useWorkspacesList();

    return <div>
        {workspacesList.map(workspace => (
            <WorkspaceEditor key={workspace.id} workspace={workspace}/>
        ))}
        {!workspacesList.length && (
            <EmptyListMessage>
                No workspaces found. Create one using the form above.
            </EmptyListMessage>
        )}
    </div>;
};

export const WorkspacesList = () => (
    <>
        <Suspense fallback={<div>Loading...</div>}>
            <WorkspacesListProvider>
                <CreateWorkspaceForm cta="Create workspace" title="Create Workspace" submitText="Create Workspace"/>
                <WorkspacesListCore/>
            </WorkspacesListProvider>
        </Suspense>
    </>
);
