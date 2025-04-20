import {useMutation} from '@apollo/client';

import {Role} from '@/types/roles';
import {CreateRoleForm} from '@/pages/dashboard/components/CreateRoleForm';
import {Button} from '@/components/Button';
import {DELETE_ROLE} from '@/graphql/roles';

type Props = {
    role: Role;
}
export const RoleEditor = ({role}: Props) => {
    const [deleteRole, {loading: deleteLoading}] = useMutation(DELETE_ROLE, {
        onCompleted: (data) => {
            // setSuccessMessage(`Role "${data.editRole.Name}" changed successfully!`);
            // setErrorMessage(null);
            // setOpen(false);
        },
        onError: (error) => {
            // setErrorMessage(`Error creating role: ${error.message}`);
            // setSuccessMessage(null);
        }
    });

    const handleDelete = async () => {
        console.log(`Deleting role: ${role.Id}`);
        await deleteRole({
            variables: {
                roleId: role.Id
            }
        });
    };

    return (
        <div>
            <div>
                name: <b>{role.Name}</b>
            </div>
            <div>
                permissions: <b>{role.Permissions.join(', ')}</b>
            </div>
            <div>
                settings: <b>{role.Settings.Base ? 'Base' : 'non-Base'}</b>
            </div>
            <div>
                <CreateRoleForm cta="Edit" submitText="Save Role" role={role}/>
                <Button onClick={handleDelete}>
                    Delete
                </Button>
            </div>
        </div>
    )
};
