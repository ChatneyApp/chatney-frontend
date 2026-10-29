import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { CREATE_USER, UPDATE_USER } from '@/graphql/adminUsers';
import { useUsersList } from '@/contexts/UsersListContext';
import { useRolesList } from '@/contexts/RolesListContext';
import { AdminUser } from '@/types/users';
import { RoleId } from '@/types/roles';
import { validateNickname, MAX_NICKNAME_LENGTH } from '@/helpers/nickname';
import {
    FORBIDDEN_ACTION,
    getGraphQLErrorCode,
    INVALID_NICKNAME,
    NICKNAME_TAKEN,
    NOT_FOUND,
    ROLE_NOT_FOUND,
} from '@/helpers/graphqlErrors';

import styles from './UserFormModal.module.css';

type FormInputs = {
    nickname: string;
    fullName: string;
    email: string;
    password: string;
    active: boolean;
    verified: boolean;
    banned: boolean;
    muted: boolean;
    roleIds: RoleId[];
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: AdminUser;
};

const getDefaultValues = (user?: AdminUser): FormInputs => ({
    nickname: user?.nickname ?? '',
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    password: '',
    active: user?.active ?? true,
    verified: user?.verified ?? false,
    banned: user?.banned ?? false,
    muted: user?.muted ?? false,
    roleIds: user?.roleIds ?? [],
});

export function UserFormModal({ open, onOpenChange, user }: Props) {
    const { t } = useTranslation();
    const { refetch } = useUsersList();
    const { roles, refetch: refetchRoles } = useRolesList();
    const isEditing = Boolean(user);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        setError,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: getDefaultValues(user),
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
            setErrorMessage(null);
            reset(getDefaultValues(user));
        }
    };

    const handleSubmitError = (error: unknown) => {
        switch (getGraphQLErrorCode(error)) {
            case INVALID_NICKNAME:
                setError('nickname', { message: t('validation.nicknameInvalid') });
                return;
            case NICKNAME_TAKEN:
                setError('nickname', { message: t('validation.nicknameTaken') });
                return;
            case ROLE_NOT_FOUND:
                refetchRoles();
                setErrorMessage(t('admin.users.errors.roleNotFound'));
                return;
            case FORBIDDEN_ACTION:
                setErrorMessage(isEditing
                    ? t('admin.users.errors.editForbidden')
                    : t('admin.users.errors.createForbidden'));
                return;
            case NOT_FOUND:
                if (isEditing) {
                    setErrorMessage(t('admin.users.errors.editNotFound'));
                    return;
                }
                break;
        }

        setErrorMessage(isEditing
            ? t('admin.users.errors.editFailed')
            : t('admin.users.errors.createFailed'));
    };

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage(null);
        // Drops roles deleted since the form opened, so a retry after ROLE_NOT_FOUND can succeed
        const roleIds = data.roleIds.filter((roleId) => roles.some((role) => role.id === roleId));

        try {
            if (user) {
                await updateUser({
                    variables: {
                        userDto: {
                            id: user.id,
                            nickname: data.nickname.trim(),
                            fullName: data.fullName.trim() || null,
                            email: data.email.trim(),
                            active: data.active,
                            verified: data.verified,
                            banned: data.banned,
                            muted: data.muted,
                            password: data.password.trim() || null,
                            roleIds,
                        },
                    },
                });
                return;
            }

            await createUser({
                variables: {
                    userDto: {
                        nickname: data.nickname.trim(),
                        fullName: data.fullName.trim() || null,
                        email: data.email.trim(),
                        password: data.password,
                        active: data.active,
                        verified: data.verified,
                        banned: data.banned,
                        muted: data.muted,
                        roleIds,
                    },
                },
            });
        } catch (error) {
            handleSubmitError(error);
        }
    };

    const isSubmitting = createLoading || updateLoading;

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container}>
                    <Dialog.Title className={styles.title}>
                        {isEditing ? t('admin.users.form.editTitle') : t('admin.users.form.createTitle')}
                    </Dialog.Title>

                    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="user-nickname">{t('admin.users.form.nickname')}</label>
                            <input
                                id="user-nickname"
                                className={styles.input}
                                {...register('nickname', { validate: (value) => validateNickname(value, t) })}
                                maxLength={MAX_NICKNAME_LENGTH}
                            />
                            {errors.nickname && (
                                <span className={styles.errorText}>{errors.nickname.message}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="user-full-name">{t('admin.users.form.fullName')}</label>
                            <input
                                id="user-full-name"
                                className={styles.input}
                                placeholder={t('common.optional')}
                                {...register('fullName')}
                            />
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="user-email">{t('admin.users.form.email')}</label>
                            <input
                                id="user-email"
                                type="email"
                                className={styles.input}
                                {...register('email', { required: t('validation.emailRequired') })}
                            />
                            {errors.email && (
                                <span className={styles.errorText}>{errors.email.message}</span>
                            )}
                        </div>

                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="user-password">
                                {isEditing ? t('admin.users.form.newPassword') : t('admin.users.form.password')}
                            </label>
                            <input
                                id="user-password"
                                type="password"
                                autoComplete="new-password"
                                className={styles.input}
                                {...register('password', {
                                    required: isEditing ? false : t('validation.passwordRequired'),
                                    validate: (value) => {
                                        if (!value || value.length >= 6) {
                                            return true;
                                        }
                                        return t('validation.passwordTooShort', { count: 6 });
                                    },
                                })}
                            />
                            {isEditing && (
                                <span className={styles.hint}>{t('admin.users.form.passwordHint')}</span>
                            )}
                            {errors.password && (
                                <span className={styles.errorText}>{errors.password.message}</span>
                            )}
                        </div>

                        <div className={styles.checkboxRow}>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} {...register('active')} />
                                {t('userStatus.active')}
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} {...register('verified')} />
                                {t('userStatus.verified')}
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} {...register('banned')} />
                                {t('userStatus.banned')}
                            </label>
                            <label className={styles.checkboxLabel}>
                                <input type="checkbox" className={styles.checkbox} {...register('muted')} />
                                {t('userStatus.muted')}
                            </label>
                        </div>

                        <div className={styles.field} role="group" aria-labelledby="user-roles-label">
                            <span id="user-roles-label" className={styles.label}>{t('admin.users.form.roles')}</span>
                            <Controller
                                control={control}
                                name="roleIds"
                                render={({ field }) => (
                                    <div className={styles.checkboxRow}>
                                        {roles.map((role) => (
                                            <label key={role.id} className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkbox}
                                                    checked={field.value.includes(role.id)}
                                                    onChange={(event) => field.onChange(
                                                        event.target.checked
                                                            ? [...field.value, role.id]
                                                            : field.value.filter((id) => id !== role.id),
                                                    )}
                                                />
                                                {role.name}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            />
                            {!isEditing && (
                                <span className={styles.hint}>{t('admin.users.form.rolesCreateHint')}</span>
                            )}
                        </div>

                        {errorMessage && (
                            <div role="alert" className={styles.errorMessage}>{errorMessage}</div>
                        )}

                        <div className={styles.bottomButtons}>
                            <Dialog.Close asChild>
                                <button type="button" className={styles.cancelButton}>
                                    {t('common.cancel')}
                                </button>
                            </Dialog.Close>
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? t('common.saving')
                                    : isEditing
                                        ? t('common.saveChanges')
                                        : t('admin.users.create')}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
