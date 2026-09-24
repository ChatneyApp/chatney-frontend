import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Dialog } from 'radix-ui';

import { CREATE_ROLE, EDIT_ROLE } from '@/graphql/roles';
import { useRolesList } from '@/contexts/RolesListContext';
import { Role } from '@/types/roles';

import styles from './RoleFormModal.module.css';

type FormInputs = {
    name: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: Role;
};

export function RoleFormModal({ open, onOpenChange, role }: Props) {
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
                    },
                },
            });
            return;
        }

        await createRole({
            variables: {
                roleDto: {
                    name: data.name,
                },
            },
        });
    };

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
