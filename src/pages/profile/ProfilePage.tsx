import { Suspense, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';

import { GET_MY_PROFILE, UPDATE_MY_PROFILE, type UpdateMyProfileResponse } from '@/graphql/profile';
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

    const [updateProfile, { loading }] = useMutation<UpdateMyProfileResponse>(UPDATE_MY_PROFILE);

    const newPassword = watch('newPassword');
    const avatarUrl = watch('avatarUrl').trim();

    const onSubmit = async (formData: ProfileFormInputs) => {
        setSuccessMessage(null);
        setErrorMessage(null);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setErrorMessage('New passwords do not match');
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

            setSuccessMessage('Profile updated successfully');
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
                        {profile.globalRoleName ?? 'No role assigned'}
                    </div>
                    <div className={styles.badges}>
                        <StatusBadge
                            label={user.active ? 'Active' : 'Inactive'}
                            active={user.active}
                            activeClass={styles.badgePositive}
                            inactiveClass={styles.badgeNeutral}
                        />
                        <StatusBadge
                            label={user.verified ? 'Verified' : 'Not verified'}
                            active={user.verified}
                            activeClass={styles.badgePositive}
                            inactiveClass={styles.badgeWarning}
                        />
                        {user.muted && (
                            <span className={`${styles.badge} ${styles.badgeWarning}`}>Muted</span>
                        )}
                        {user.banned && (
                            <span className={`${styles.badge} ${styles.badgeDanger}`}>Banned</span>
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
                    <h2 className={styles.cardTitle}>Account details</h2>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="profile-nickname">Nickname</label>
                        <input
                            id="profile-nickname"
                            className={styles.input}
                            {...register('nickname', { validate: validateNickname })}
                            maxLength={MAX_NICKNAME_LENGTH}
                        />
                        {errors.nickname && (
                            <span className={styles.errorText}>{errors.nickname.message}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="profile-full-name">Full name</label>
                        <input
                            id="profile-full-name"
                            className={styles.input}
                            placeholder="Optional"
                            {...register('fullName')}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="profile-email">Email</label>
                        <input
                            id="profile-email"
                            type="email"
                            className={styles.input}
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && (
                            <span className={styles.errorText}>{errors.email.message}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="profile-avatar">Avatar URL</label>
                        <input
                            id="profile-avatar"
                            type="url"
                            className={styles.input}
                            placeholder="https://..."
                            {...register('avatarUrl')}
                        />
                        <span className={styles.hint}>Optional image URL for your avatar</span>
                    </div>
                </section>

                <section className={styles.card}>
                    <h2 className={styles.cardTitle}>Change password</h2>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="current-password">
                            Current password
                        </label>
                        <input
                            id="current-password"
                            type="password"
                            autoComplete="current-password"
                            className={styles.input}
                            {...register('currentPassword', {
                                required: newPassword ? 'Current password is required' : false,
                            })}
                        />
                        {errors.currentPassword && (
                            <span className={styles.errorText}>
                                {errors.currentPassword.message}
                            </span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="new-password">New password</label>
                        <input
                            id="new-password"
                            type="password"
                            autoComplete="new-password"
                            className={styles.input}
                            {...register('newPassword', {
                                minLength: newPassword
                                    ? { value: 6, message: 'Password must be at least 6 characters' }
                                    : undefined,
                            })}
                        />
                        {errors.newPassword && (
                            <span className={styles.errorText}>{errors.newPassword.message}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="confirm-password">
                            Confirm new password
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
                        {loading ? 'Saving...' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export function ProfilePage() {
    return (
        <Suspense fallback={<div className={styles.loading}>Loading profile...</div>}>
            <ProfilePageContent />
        </Suspense>
    );
}
