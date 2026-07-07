import { useForm } from 'react-hook-form';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { Dialog } from 'radix-ui';

import { CREATE_ROLE, EDIT_ROLE } from '@/graphql/roles';
import { GET_PERMISSIONS_LIST } from '@/graphql/permissions';
import { useRolesList } from '@/contexts/RolesListContext';
import { Role } from '@/types/roles';

import { formatPermissionLabel } from '@/helpers/permissions';

import styles from './RoleFormModal.module.css';

type FormInputs = {
    name: string;
    permissions: string[];
    isProtected: boolean;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: Role;
};

export function RoleFormModal({ open, onOpenChange, role }: Props) {
    const { data: permissionsData } = useSuspenseQuery(GET_PERMISSIONS_LIST);
    const { refetch } = useRolesList();
    const isEditing = Boolean(role);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: {
            name: role?.name ?? '',
            permissions: role?.permissions ?? [],
            isProtected: role?.isProtected ?? false,
        },
    });

    const [createRole, { loading: createLoading }] = useMutation(CREATE_ROLE, {
        onCompleted: () => {
            onOpenChange(false);
            reset();
            refetch();
        },
    });

    const [editRole, { loading: editLoading }] = useMutation(EDIT_ROLE, {
        onCompleted: () => {
            onOpenChange(false);
            reset();
            refetch();
        },
    });

    const handleOpenChange = (nextOpen: boolean) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
            reset({
                name: role?.name ?? '',
                permissions: role?.permissions ?? [],
                isProtected: role?.isProtected ?? false,
            });
        }
    };

    const onSubmit = async (data: FormInputs) => {
        if (role) {
            await editRole({
                variables: {
                    roleDto: {
                        id: role.id,
                        name: data.name,
                        permissions: data.permissions,
                        isProtected: data.isProtected,
                    },
                },
            });
            return;
        }

        await createRole({
            variables: {
                roleDto: {
                    name: data.name,
                    permissions: data.permissions,
                    isProtected: data.isProtected,
                },
            },
        });
    };

    const permissionGroups = permissionsData.permissions.list;
    const isSubmitting = createLoading || editLoading;

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container}>
                    <Dialog.Title className={styles.title}>
                        {isEditing ? 'Edit role' : 'Create role'}
                    </Dialog.Title>

                    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="role-name">
                                Name
                            </label>
                            <input
                                id="role-name"
                                className={styles.input}
                                {...register('name', { required: 'Role name is required' })}
                            />
                            {errors.name && (
                                <span className={styles.errorText}>{errors.name.message}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <span className={styles.label}>Permissions</span>
                            <div className={styles.permissionGroups}>
                                {permissionGroups.map((group) => (
                                    <div key={group.label}>
                                        <h4 className={styles.permissionGroupTitle}>{group.label}</h4>
                                        <div className={styles.permissionList}>
                                            {group.list.map((permission) => (
                                                <label
                                                    key={permission}
                                                    className={styles.permissionItem}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        className={styles.checkbox}
                                                        value={permission}
                                                        {...register('permissions')}
                                                    />
                                                    {formatPermissionLabel(permission)}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <label className={styles.protectedLabel}>
                            <input
                                type="checkbox"
                                className={styles.checkbox}
                                {...register('isProtected')}
                            />
                            Protected role (cannot be deleted)
                        </label>

                        <div className={styles.bottomButtons}>
                            <Dialog.Close asChild>
                                <button type="button" className={styles.cancelButton}>
                                    Cancel
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? 'Saving...'
                                    : isEditing
                                      ? 'Save changes'
                                      : 'Create role'}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
