import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { CREATE_USER, UPDATE_USER } from '@/graphql/adminUsers';
import { useUsersList } from '@/contexts/UsersListContext';
import { User } from '@/types/users';
import { validateNickname, MAX_NICKNAME_LENGTH } from '@/helpers/nickname';

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
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
};

export function UserFormModal({ open, onOpenChange, user }: Props) {
    const { t } = useTranslation();
    const { refetch } = useUsersList();
    const isEditing = Boolean(user);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormInputs>({
        defaultValues: {
            nickname: user?.nickname ?? '',
            fullName: user?.fullName ?? '',
            email: user?.email ?? '',
            password: '',
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
                nickname: user?.nickname ?? '',
                fullName: user?.fullName ?? '',
                email: user?.email ?? '',
                password: '',
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
                    // TODO: UpdateUserDtoInput requires roleIds and the backend syncs the user's roles to it,
                    // but the schema exposes no way to read a user's current roles, so they can't be sent safely.
                    // @ts-expect-error roleIds is missing
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
