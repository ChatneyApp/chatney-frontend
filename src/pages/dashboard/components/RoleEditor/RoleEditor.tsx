import {useMutation} from '@apollo/client';

import {Role} from '@/types/roles';
import {CreateRoleForm} from '@/pages/dashboard/components/RoleForm/CreateRoleForm';
import {Button} from '@/components/Button';
import {DELETE_ROLE} from '@/graphql/roles';
import {useRolesList} from '@/contexts/RolesListContext';
import styles from './RoleEditor.module.css';

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
                id: role.id
            }
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                {role.name}
            </div>
            <div className={styles.uuid}>
                {role.id}
            </div>
            <div className={styles.permissions}>
                Permissions: <b>{role.permissions.join(', ')}</b>
            </div>
            <div className={styles.settings}>
                Settings: <b>{role.settings.base ? 'Base' : 'non-Base'}</b>
            </div>
            <div className={styles.controls}>
                <CreateRoleForm cta="Edit" title="Edit Role" submitText="Save Changes" role={role}/>
                <Button onClick={handleDelete} className="text-red-400">
                    Delete
                </Button>
            </div>
        </div>
    )
};
