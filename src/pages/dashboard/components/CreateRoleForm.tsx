import {useForm} from 'react-hook-form';
import {useMutation, useQuery} from '@apollo/client';
import {useState} from 'react';
import {Dialog} from 'radix-ui';

import styles from './CreateRoleForm.module.css';
import dialogStyles from '@/components/Popup/Popup.module.css';
import {CREATE_ROLE} from '@/graphql/roles';
import {GET_PERMISSIONS_LIST} from '@/graphql/permissions';
import {Button} from '@/components/Button';

type FormInputs = {
    name: string;
    permissions: string[];
    isBaseRole: boolean;
};

// Define the type for permission groups
type PermissionGroup = {
    label: string;
    list: string[];
};

export const CreateRoleForm = () => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch permissions list
    const {
        data: permissionsData,
        loading: permissionsLoading,
        error: permissionsError
    } = useQuery(GET_PERMISSIONS_LIST);

    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormInputs>({
        defaultValues: {
            name: '',
            permissions: [],
            isBaseRole: false
        }
    });

    const [createRole, {loading}] = useMutation(CREATE_ROLE, {
        onCompleted: (data) => {
            setSuccessMessage(`Role "${data.createRole.Name}" created successfully!`);
            setErrorMessage(null);
            reset();
            // Clear success message after 3 seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error) => {
            setErrorMessage(`Error creating role: ${error.message}`);
            setSuccessMessage(null);
        }
    });

    const onSubmit = async (data: FormInputs) => {
        try {
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
            setOpen(false);
        } catch (e) {
            console.error('submit error', e);
        }
    };

    // Get permission groups from the query result or show loading/error state
    const permissionGroups: PermissionGroup[] = permissionsData?.getPermissionsList?.groups || [];

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button>Create role</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={dialogStyles.overlay}/>
                <Dialog.Content className={dialogStyles.container}>
                    <Dialog.Title className={dialogStyles.title}>
                        Create Role
                    </Dialog.Title>
                    <Dialog.Description className={dialogStyles.description}>
                        Create a new role with the specified permissions and settings.
                    </Dialog.Description>
                    <div className={styles.formContainer}>
                        {successMessage && (
                            <div className={styles.successMessage}>{successMessage}</div>
                        )}
                        {errorMessage && (
                            <div className={styles.errorMessage}>{errorMessage}</div>
                        )}
                        {permissionsError && (
                            <div className={styles.errorMessage}>
                                Error loading permissions: {permissionsError.message}
                            </div>
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
                                {permissionsLoading ? (
                                    <div>Loading permissions...</div>
                                ) : (
                                    permissionGroups.map((group, groupIndex) => (
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
                                    ))
                                )}
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
                                    disabled={loading || permissionsLoading}
                                >
                                    {loading ? 'Creating...' : 'Create Role'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
