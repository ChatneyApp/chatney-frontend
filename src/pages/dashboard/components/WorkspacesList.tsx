import {Suspense} from 'react';

import {WorkspaceEditor} from '@/pages/dashboard/components/WorkspaceEditor/WorkspaceEditor';
import {CreateWorkspaceForm} from '@/pages/dashboard/components/WorkspaceForm/CreateWorkspaceForm';
import {WorkspacesListProvider, useWorkspacesList} from '@/contexts/WorkspacesListContext';

const WorkspacesListCore = () => {
    const {workspaces} = useWorkspacesList();

    return <div>
        {workspaces.map(workspace => (
            <WorkspaceEditor key={workspace.Id} workspace={workspace}/>
        ))}
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