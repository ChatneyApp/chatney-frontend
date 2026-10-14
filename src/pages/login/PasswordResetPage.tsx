import { useState } from 'react';
import type { ReactNode } from 'react';
import { useApolloClient } from '@apollo/client/react';
import { AtSign, Lock } from 'lucide-react';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';

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
}) => (
    <div className={styles.page}>
        <div className={styles.card}>
            <h1 className={styles.title}>{title}</h1>
            <p className={styles.subtitle}>{subtitle}</p>
            {children}
            <p className={styles.switchMode}>
                <a href={loginPageUrl} className={styles.switchLink}>Back to sign in</a>
            </p>
        </div>
    </div>
);

export const ForgotPasswordPage = () => {
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
            setErrorMessage('Unable to request a password reset. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PasswordPageLayout
            title="Forgot your password?"
            subtitle="Enter the email or nickname associated with your account."
        >
            {submitted ? (
                <div className={clsx(styles.alert, styles.alertSuccess, 'mt-6')}>
                    If email exists, you will get password reset link.
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
                            <label htmlFor="login" className={styles.label}>Email or nickname</label>
                            <div className={clsx(styles.inputWrapper, errors.login && styles.inputWrapperError)}>
                                <AtSign size={16} className={styles.inputIcon} aria-hidden />
                                <input
                                    id="login"
                                    type="text"
                                    autoComplete="username"
                                    placeholder="name@company.com"
                                    {...register('login', { required: 'Email or nickname is required' })}
                                    className={styles.input}
                                />
                            </div>
                            {errors.login && <span className={styles.errorText}>{errors.login.message}</span>}
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? 'Sending...' : 'Send reset link'}
                        </button>
                    </form>
                </>
            )}
        </PasswordPageLayout>
    );
};

export const ResetPasswordPage = () => {
    const apollo = useApolloClient();
    const code = new URLSearchParams(window.location.search).get('code');
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(
        code ? null : 'This password reset link is invalid.',
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
                setErrorMessage('This password reset link is invalid or has expired.');
                return;
            }
            setCompleted(true);
        } catch {
            setErrorMessage('Unable to reset your password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PasswordPageLayout
            title="Reset your password"
            subtitle="Choose a new password for your Chatney account."
        >
            {completed ? (
                <div className={clsx(styles.alert, styles.alertSuccess, 'mt-6')}>
                    Your password has been reset. You can now sign in.
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
                            <label htmlFor="password" className={styles.label}>Password</label>
                            <div className={clsx(styles.inputWrapper, errors.password && styles.inputWrapperError)}>
                                <Lock size={16} className={styles.inputIcon} aria-hidden />
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('password', { required: 'Password is required' })}
                                    className={styles.input}
                                />
                            </div>
                            {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                        </div>
                        <div className={styles.field}>
                            <label htmlFor="confirmPassword" className={styles.label}>Confirm password</label>
                            <div className={clsx(styles.inputWrapper, errors.confirmPassword && styles.inputWrapperError)}>
                                <Lock size={16} className={styles.inputIcon} aria-hidden />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    {...register('confirmPassword', {
                                        required: 'Please confirm your password',
                                        validate: value => value === watch('password') || 'Passwords do not match',
                                    })}
                                    className={styles.input}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <span className={styles.errorText}>{errors.confirmPassword.message}</span>
                            )}
                        </div>
                        <button type="submit" className={styles.submitButton} disabled={loading || !code}>
                            {loading ? 'Resetting...' : 'Reset password'}
                        </button>
                    </form>
                </>
            )}
        </PasswordPageLayout>
    );
};
