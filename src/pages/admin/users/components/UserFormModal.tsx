import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Dialog } from 'radix-ui';

import { CREATE_USER, UPDATE_USER } from '@/graphql/adminUsers';
import { useUsersList } from '@/contexts/UsersListContext';
import { useRolesList } from '@/contexts/RolesListContext';
import { User } from '@/types/users';

import styles from './UserFormModal.module.css';

type FormInputs = {
    name: string;
    email: string;
    password: string;
    roleId: number;
    active: boolean;
    verified: boolean;
    banned: boolean;
    muted: boolean;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
};

export function UserFormModal({ open, onOpenChange, user }: Props) {
    const { roles } = useRolesList();
    const { refetch } = useUsersList();
    const isEditing = Boolean(user);
    const defaultRoleId = user?.roleId ?? roles[0]?.id ?? 0;

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: {
            name: user?.name ?? '',
            email: user?.email ?? '',
            password: '',
            roleId: defaultRoleId,
            active: user?.active ?? true,
            verified: user?.verified ?? false,
            banned: user?.banned ?? false,
            muted: user?.muted ?? false,
        },
    });

    const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
        onCompleted: () => {
            onOpenChange(false);
            reset();
            refetch();
        },
    });

    const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
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
                name: user?.name ?? '',
                email: user?.email ?? '',
                password: '',
                roleId: defaultRoleId,
                active: user?.active ?? true,
                verified: user?.verified ?? false,
                banned: user?.banned ?? false,
                muted: user?.muted ?? false,
            });
        }
    };

    const onSubmit = async (data: FormInputs) => {
        if (user) {
            await updateUser({
                variables: {
                    userDto: {
                        id: user.id,
                        name: data.name.trim(),
                        email: data.email.trim(),
                        roleId: data.roleId,
                        active: data.active,
                        verified: data.verified,
                        banned: data.banned,
                        muted: data.muted,
                        password: data.password.trim() || null,
                    },
                },
            });
            return;
        }

        await createUser({
            variables: {
                userDto: {
                    name: data.name.trim(),
                    email: data.email.trim(),
                    password: data.password,
                    roleId: data.roleId,
                    active: data.active,
                    verified: data.verified,
                    banned: data.banned,
                    muted: data.muted,
                },
            },
        });
    };

    const isSubmitting = createLoading || updateLoading;

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container}>
                    <Dialog.Title className={styles.title}>
                        {isEditing ? 'Edit user' : 'Create user'}
                    </Dialog.Title>

                    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="user-name">Name</label>
                            <input
                                id="user-name"
                                className={styles.input}
                                {...register('name', { required: 'Name is required' })}
                            />
                            {errors.name && (
                                <span className={styles.errorText}>{errors.name.message}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="user-email">Email</label>
                            <input
                                id="user-email"
                                type="email"
                                className={styles.input}
                                {...register('email', { required: 'Email is required' })}
                            />
                            {errors.email && (
                                <span className={styles.errorText}>{errors.email.message}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="user-role">Role</label>
                            <select
                                id="user-role"
                                className={styles.select}
                                {...register('roleId', {
                                    required: 'Role is required',
                                    valueAsNumber: true,
                                })}
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {errors.roleId && (
                                <span className={styles.errorText}>{errors.roleId.message}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="user-password">
                                {isEditing ? 'New password' : 'Password'}
                            </label>
                            <input
                                id="user-password"
                                type="password"
                                autoComplete="new-password"
                                className={styles.input}
                                {...register('password', {
                                    required: isEditing ? false : 'Password is required',
                                    validate: (value) => {
                                        if (!value || value.length >= 6) {
                                            return true;
                                        }
                                        return 'Password must be at least 6 characters';
                                    },
                                })}
                            />
                            {isEditing && (
                                <span className={styles.hint}>Leave blank to keep current password</span>
                            )}
                            {errors.password && (
                                <span className={styles.errorText}>{errors.password.message}</span>
                            )}
                        </div>

                        <div className={styles.checkboxRow}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} {...register('active')} />
                                Active
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} {...register('verified')} />
                                Verified
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} {...register('banned')} />
                                Banned
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} {...register('muted')} />
                                Muted
                            </label>
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
                                      : 'Create user'}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
