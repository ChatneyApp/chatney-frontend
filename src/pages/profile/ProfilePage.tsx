import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { GET_MY_PROFILE, UPDATE_MY_PROFILE } from '@/graphql/profile';
import { useUser } from '@/contexts/UserContext';
import { getUserAvatarInitial, getUserDisplayName, validateNickname, MAX_NICKNAME_LENGTH } from '@/helpers/nickname';

import styles from './ProfilePage.module.css';

type ProfileFormInputs = {
    nickname: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

function StatusBadge({
    label,
    active,
    activeClass,
    inactiveClass,
}: {
    label: string;
    active: boolean;
    activeClass: string;
    inactiveClass: string;
}) {
    return (
        <span className={`${styles.badge} ${active ? activeClass : inactiveClass}`}>
            {label}
        </span>
    );
}

function ProfilePageContent() {
    const { t } = useTranslation();
    const { data, refetch } = useSuspenseQuery(GET_MY_PROFILE, { fetchPolicy: 'no-cache' });
    const { refreshUser } = useUser()!;
    const profile = data.users.myProfile;
    const user = profile.user;

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<ProfileFormInputs>({
        defaultValues: {
            nickname: user.nickname,
            fullName: user.fullName ?? '',
            email: user.email,
            avatarUrl: user.avatarUrl ?? '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const [updateProfile, { loading }] = useMutation(UPDATE_MY_PROFILE);

    const newPassword = watch('newPassword');
    const avatarUrl = watch('avatarUrl').trim();

    const onSubmit = async (formData: ProfileFormInputs) => {
        setSuccessMessage(null);
        setErrorMessage(null);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setErrorMessage(t('validation.newPasswordsDoNotMatch'));
            return;
        }

        try {
            await updateProfile({
                variables: {
                    profileDto: {
                        nickname: formData.nickname.trim(),
                        fullName: formData.fullName.trim() || null,
                        email: formData.email.trim(),
                        avatarUrl: formData.avatarUrl.trim() || null,
                        currentPassword: formData.newPassword ? formData.currentPassword : null,
                        newPassword: formData.newPassword || null,
                    },
                },
            });

            setSuccessMessage(t('profile.updated'));
            const refreshed = await refetch();
            await refreshUser();
            const refreshedUser = refreshed.data!.users.myProfile.user;

            reset({
                nickname: refreshedUser.nickname,
                fullName: refreshedUser.fullName ?? '',
                email: refreshedUser.email,
                avatarUrl: refreshedUser.avatarUrl ?? '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error) {
            setErrorMessage((error as Error).message);
        }
    };

    const avatarInitial = getUserAvatarInitial(user);
    const displayName = getUserDisplayName(user);

    return (
        <div className={styles.page}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="" className={styles.avatarImage} />
                    ) : (
                        avatarInitial
                    )}
                </div>
                <div className={styles.profileMeta}>
                    <h1 className={styles.profileName}>{displayName}</h1>
                    <div className={styles.profileRole}>@{user.nickname}</div>
                    <div className={styles.profileRole}>
                        {profile.roleNames?.join(' / ') ?? t('profile.noRole')}
                    </div>
                    <div className={styles.badges}>
                        <StatusBadge
                            label={user.active ? t('userStatus.active') : t('userStatus.inactive')}
                            active={user.active}
                            activeClass={styles.badgePositive}
                            inactiveClass={styles.badgeNeutral}
                        />
                        <StatusBadge
                            label={user.verified ? t('userStatus.verified') : t('userStatus.notVerified')}
                            active={user.verified}
                            activeClass={styles.badgePositive}
                            inactiveClass={styles.badgeWarning}
                        />
                        {user.muted && (
                            <span className={`${styles.badge} ${styles.badgeWarning}`}>{t('userStatus.muted')}</span>
                        )}
                        {user.banned && (
                            <span className={`${styles.badge} ${styles.badgeDanger}`}>{t('userStatus.banned')}</span>
                        )}
                    </div>
                </div>
            </div>

            {successMessage && (
                <div className={styles.successMessage}>{successMessage}</div>
            )}
            {errorMessage && (
                <div className={styles.errorMessage}>{errorMessage}</div>
            )}

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>{t('profile.accountDetails')}</h2>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="profile-nickname">{t('profile.nickname')}</label>
                        <input
                            id="profile-nickname"
                            className={styles.input}
                            {...register('nickname', { validate: (value) => validateNickname(value, t) })}
                            maxLength={MAX_NICKNAME_LENGTH}
                        />
                        {errors.nickname && (
                            <span className={styles.errorText}>{errors.nickname.message}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="profile-full-name">{t('profile.fullName')}</label>
                        <input
                            id="profile-full-name"
                            className={styles.input}
                            placeholder={t('common.optional')}
                            {...register('fullName')}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="profile-email">{t('profile.email')}</label>
                        <input
                            id="profile-email"
                            type="email"
                            className={styles.input}
                            {...register('email', { required: t('validation.emailRequired') })}
                        />
                        {errors.email && (
                            <span className={styles.errorText}>{errors.email.message}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="profile-avatar">{t('profile.avatarUrl')}</label>
                        <input
                            id="profile-avatar"
                            type="url"
                            className={styles.input}
                            placeholder="https://..."
                            {...register('avatarUrl')}
                        />
                        <span className={styles.hint}>{t('profile.avatarUrlHint')}</span>
                    </div>
                </section>

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>{t('profile.changePassword')}</h2>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="current-password">
                            {t('profile.currentPassword')}
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            autoComplete="current-password"
                            className={styles.input}
                            {...register('currentPassword', {
                                required: newPassword ? t('validation.currentPasswordRequired') : false,
                            })}
                        />
                        {errors.currentPassword && (
                            <span className={styles.errorText}>
                                {errors.currentPassword.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="new-password">{t('profile.newPassword')}</label>
                        <input
                            id="new-password"
                            type="password"
                            autoComplete="new-password"
                            className={styles.input}
                            {...register('newPassword', {
                                minLength: newPassword
                                    ? { value: 6, message: t('validation.passwordTooShort', { count: 6 }) }
                                    : undefined,
                            })}
                        />
                        {errors.newPassword && (
                            <span className={styles.errorText}>{errors.newPassword.message}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="confirm-password">
                            {t('profile.confirmNewPassword')}
                        </label>
                        <input
                            id="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            className={styles.input}
                            {...register('confirmPassword')}
                        />
                    </div>
                </section>

                <div className={styles.actions}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? t('common.saving') : t('common.saveChanges')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export function ProfilePage() {
    const { t } = useTranslation();

    return (
        <Suspense fallback={<div className={styles.loading}>{t('profile.loading')}</div>}>
            <ProfilePageContent />
        </Suspense>
    );
}
