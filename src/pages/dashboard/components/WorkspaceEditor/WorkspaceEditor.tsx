import {useMutation} from '@apollo/client';

import {Workspace} from '@/types/workspaces';
import {DELETE_WORKSPACE} from '@/graphql/workspaces';
import {Button} from '@/components/Button';
import {useWorkspacesList} from '@/contexts/WorkspacesListContext';
import {CreateWorkspaceForm} from '@/pages/dashboard/components/WorkspaceForm/CreateWorkspaceForm';

import styles from './WorkspaceEditor.module.css';

type Props = {
    workspace: Workspace;
}

export const WorkspaceEditor = ({workspace}: Props) => {
    const {refetch} = useWorkspacesList();
    const [deleteWorkspace] = useMutation(DELETE_WORKSPACE, {
        onCompleted: () => {
            refetch();
        },
        onError: () => {}
    });

    const handleDelete = async () => {
        await deleteWorkspace({
            variables: {
                workspaceId: workspace.Id
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {workspace.Name}
            </div>
            <div className={styles.uuid}>
                {workspace.Id}
            </div>
            <div className={styles.controls}>
                <CreateWorkspaceForm 
                    cta="Edit" 
                    title="Edit Workspace" 
                    submitText="Save Changes" 
                    workspace={workspace}
                />
                <Button onClick={handleDelete} className="text-red-400">
                    Delete
                </Button>
            </div>
        </div>
    )
}; 