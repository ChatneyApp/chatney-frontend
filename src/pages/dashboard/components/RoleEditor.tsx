import {Role} from '@/types/roles';

type Props = {
    role: Role;
}
export const RoleEditor = ({role}: Props) => {
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
        </div>
    )
};
