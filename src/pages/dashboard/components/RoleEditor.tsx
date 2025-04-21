import {useMutation} from '@apollo/client';

import {Role} from '@/types/roles';
import {CreateRoleForm} from '@/pages/dashboard/components/RoleForm/CreateRoleForm';
import {Button} from '@/components/Button';
import {DELETE_ROLE} from '@/graphql/roles';
import {useRolesList} from '@/contexts/RolesListContext';

type Props = {
    role: Role;
}
export const RoleEditor = ({role}: Props) => {
    const {refetch} = useRolesList();
    const [deleteRole] = useMutation(DELETE_ROLE, {
        onCompleted: () => {
            refetch();
        },
        onError: () => {}
    });

    const handleDelete = async () => {
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
