import {useForm} from 'react-hook-form';
import {useMutation, useSuspenseQuery} from '@apollo/client';
import {useState} from 'react';
import {Dialog} from 'radix-ui';

import styles from './CreateRoleForm.module.css';
import dialogStyles from '@/components/Popup/Popup.module.css';
import {CREATE_ROLE, EDIT_ROLE} from '@/graphql/roles';
import {GET_PERMISSIONS_LIST} from '@/graphql/permissions';
import {Button} from '@/components/Button';
import {Role} from '@/types/roles';
import {useRolesList} from '@/contexts/RolesListContext';

type FormInputs = {
    name: string;
    permissions: string[];
    isBaseRole: boolean;
};

type Props = {
    cta: string;
    title: string;
    submitText: string;
    role?: Role;
}
export const CreateRoleForm = ({cta, title, submitText, role}: Props) => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {data: permissionsData} = useSuspenseQuery(GET_PERMISSIONS_LIST);
    const {refetch} = useRolesList();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormInputs>({
        defaultValues: {
            name: role?.Name ?? '',
            permissions: role?.Permissions ?? [],
            isBaseRole: role?.Settings?.Base ?? false
        }
    });

    const [createRole, {loading: createLoading}] = useMutation(CREATE_ROLE, {
        onCompleted: () => {
            // setSuccessMessage(`Role "${data.createRole.Name}" created successfully!`);
            // setErrorMessage(null);
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error creating role: ${error.message}`);
            setSuccessMessage(null);
        }
    });

    const [editRole, {loading: editLoading}] = useMutation(EDIT_ROLE, {
        onCompleted: () => {
            // setSuccessMessage(`Role "${data.editRole.Name}" changed successfully!`);
            // setErrorMessage(null);
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error creating role: ${error.message}`);
            setSuccessMessage(null);
        }
    });

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            reset();
            setSuccessMessage(null);
            setErrorMessage(null);
        }
    }

    const onSubmit = async (data: FormInputs) => {
        if (role) {
            await editRole({
                variables: {
                    roleData: {
                        Id: role.Id,
                        Name: data.name,
                        Permissions: data.permissions,
                        Settings: {
                            Base: data.isBaseRole
                        }
                    }
                }
            })
        } else {
            await createRole({
                variables: {
                    roleData: {
                        Name: data.name,
                        Permissions: data.permissions,
                        Settings: {
                            Base: data.isBaseRole
                        }
                    }
                }
            });
        }
    };

    const permissionGroups = permissionsData?.getPermissionsList?.groups || [];

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <Button>{cta}</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={dialogStyles.overlay}/>
                <Dialog.Content className={dialogStyles.container}>
                    <Dialog.Title className={dialogStyles.title}>
                        {title}
                    </Dialog.Title>
                    <div className={styles.formContainer}>
                        {successMessage && (
                            <div className={styles.successMessage}>{successMessage}</div>
                        )}
                        {errorMessage && (
                            <div className={styles.errorMessage}>{errorMessage}</div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Role Name</label>
                                <input
                                    id="name"
                                    {...register("name", {required: "Role name is required"})}
                                    className={styles.input}
                                />
                                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label>Role Permissions</label>
                                {permissionGroups.map((group, groupIndex) => (
                                    <div key={groupIndex} className={styles.permissionGroup}>
                                        <h4>{group.label}</h4>
                                        <div className={styles.permissionList}>
                                            {group.list.map((permission, permIndex) => (
                                                <div key={permIndex} className={styles.permissionItem}>
                                                    <label>
                                                        <input
                                                            type="checkbox"
                                                            {...register("permissions")}
                                                            value={permission}
                                                        />
                                                        {permission.split('.')[1]}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.formGroup}>
                                <label>
                                    <input
                                        type="checkbox"
                                        {...register("isBaseRole")}
                                    />
                                    Is Base Role
                                </label>
                            </div>
                            <div className={dialogStyles.bottomButtons}>
                                <Dialog.Close asChild>
                                    <Button aria-label="Close">
                                        Cancel
                                    </Button>
                                </Dialog.Close>
                                <Button
                                    type="submit"
                                    disabled={createLoading || editLoading}
                                >
                                    {createLoading || editLoading ? 'Creating...' : submitText}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
