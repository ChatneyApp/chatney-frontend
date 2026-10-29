import { useState } from 'react';
import type { ReactNode } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { AtSign, Lock } from 'lucide-react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { requestPasswordReset, resetPassword } from '@/graphql/auth';
import { loginPageUrl } from '@/infra/consts';
import styles from './AuthForm/AuthForm.module.css';

type ForgotPasswordInputs = {
    login: string;
};

type ResetPasswordInputs = {
    password: string;
    confirmPassword: string;
};

const PasswordPageLayout = ({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle: string;
    children: ReactNode;
}) => {
    const { t } = useTranslation();

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>{title}</h1>
                <p className={styles.subtitle}>{subtitle}</p>
                {children}
                <p className={styles.switchMode}>
                    <a href={loginPageUrl} className={styles.switchLink}>{t('auth.backToSignIn')}</a>
                </p>
            </div>
        </div>
    );
};

export const ForgotPasswordPage = () => {
    const { t } = useTranslation();
    const apollo = useApolloClient();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInputs>();

    const onSubmit = async ({ login }: ForgotPasswordInputs) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            await requestPasswordReset({ client: apollo, login });
            setSubmitted(true);
        } catch {
            setErrorMessage(t('auth.forgotPassword.failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <PasswordPageLayout
            title={t('auth.forgotPassword.title')}
            subtitle={t('auth.forgotPassword.subtitle')}
        >
            {submitted ? (
                <div className={clsx(styles.alert, styles.alertSuccess, 'mt-6')}>
                    {t('auth.forgotPassword.submitted')}
                </div>
            ) : (
                <>
                    {errorMessage && (
                        <div className={clsx(styles.alert, styles.alertError, 'mt-6')}>
                            {errorMessage}
                        </div>
                    )}
                    <form className={clsx(styles.form, 'mt-7')} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.field}>
                            <label htmlFor="login" className={styles.label}>{t('auth.emailOrNickname')}</label>
                            <div className={clsx(styles.inputWrapper, errors.login && styles.inputWrapperError)}>
                                <AtSign size={16} className={styles.inputIcon} aria-hidden />
                                <input
                                    id="login"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="name@company.com"
                                    {...register('login', { required: t('validation.loginRequired') })}
                                    className={styles.input}
                                />
                            </div>
                            {errors.login && <span className={styles.errorText}>{errors.login.message}</span>}
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? t('auth.forgotPassword.sending') : t('auth.forgotPassword.submit')}
                        </button>
                    </form>
                </>
            )}
        </PasswordPageLayout>
    );
};

export const ResetPasswordPage = () => {
    const { t } = useTranslation();
    const apollo = useApolloClient();
    const code = new URLSearchParams(window.location.search).get('code');
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        code ? null : t('auth.resetPassword.invalidLink'),
    );
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordInputs>();

    const onSubmit = async ({ password }: ResetPasswordInputs) => {
        if (!code) {
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        try {
            const succeeded = await resetPassword({ client: apollo, code, password });
            if (!succeeded) {
                setErrorMessage(t('auth.resetPassword.expiredLink'));
                return;
            }
            setCompleted(true);
        } catch {
            setErrorMessage(t('auth.resetPassword.failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <PasswordPageLayout
            title={t('auth.resetPassword.title')}
            subtitle={t('auth.resetPassword.subtitle')}
        >
            {completed ? (
                <div className={clsx(styles.alert, styles.alertSuccess, 'mt-6')}>
                    {t('auth.resetPassword.completed')}
                </div>
            ) : (
                <>
                    {errorMessage && (
                        <div className={clsx(styles.alert, styles.alertError, 'mt-6')}>
                            {errorMessage}
                        </div>
                    )}
                    <form className={clsx(styles.form, 'mt-7')} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.field}>
                            <label htmlFor="password" className={styles.label}>{t('auth.password')}</label>
                            <div className={clsx(styles.inputWrapper, errors.password && styles.inputWrapperError)}>
                                <Lock size={16} className={styles.inputIcon} aria-hidden />
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('password', { required: t('validation.passwordRequired') })}
                                    className={styles.input}
                                />
                            </div>
                            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="confirmPassword" className={styles.label}>{t('auth.confirmPassword')}</label>
                            <div className={clsx(styles.inputWrapper, errors.confirmPassword && styles.inputWrapperError)}>
                                <Lock size={16} className={styles.inputIcon} aria-hidden />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword', {
                                        required: t('validation.confirmPasswordRequired'),
                                        validate: value => value === watch('password') || t('validation.passwordsDoNotMatch'),
                                    })}
                                    className={styles.input}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <span className={styles.errorText}>{errors.confirmPassword.message}</span>
                            )}
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={loading || !code}>
                            {loading ? t('auth.resetPassword.resetting') : t('auth.resetPassword.submit')}
                        </button>
                    </form>
                </>
            )}
        </PasswordPageLayout>
    );
};
