import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApolloClient } from '@apollo/client/react';
import { AtSign, Lock } from 'lucide-react';
import clsx from 'clsx';

import styles from './AuthForm.module.css';
import { clientStartPageUrl, userAuthTokenName, userAuthId } from '@/infra/consts';
import { loginUser } from '@/graphql/auth';

type FormInputs = {
    login: string;
    password: string;
};

export const LoginForm = () => {
    const apollo = useApolloClient();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            login: '',
            password: '',
        },
    });

    const onSubmit = async (data: FormInputs) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            const out = await loginUser({
                client: apollo,
                login: data.login,
                password: data.password,
            });

            localStorage.setItem(userAuthTokenName, out.token);
            localStorage.setItem(userAuthId, out.id.toString());
            window.location.href = clientStartPageUrl;
        } catch (error) {
            setErrorMessage(`Login error: ${(error as Error).message}`);
        }

        setLoading(false);
    };

    return (
        <div>
            {errorMessage && (
                <div className={clsx(styles.alert, styles.alertError, 'mb-5')}>
                    {errorMessage}
                </div>
            )}

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.field}>
                    <label htmlFor="login" className={styles.label}>Work email</label>
                    <div className={clsx(styles.inputWrapper, errors.login && styles.inputWrapperError)}>
                        <AtSign size={16} className={styles.inputIcon} aria-hidden />
                        <input
                            id="login"
                            type="text"
                            placeholder="name@company.com"
                            autoComplete="username"
                            {...register('login', { required: 'Email or nickname is required' })}
                            className={styles.input}
                        />
                    </div>
                    {errors.login && <span className={styles.errorText}>{errors.login.message}</span>}
                </div>

                <div className={styles.field}>
                    <div className={styles.labelRow}>
                        <label htmlFor="password" className={styles.label}>Password</label>
                        <button type="button" className={styles.forgotLink}>Forgot?</button>
                    </div>
                    <div className={clsx(styles.inputWrapper, errors.password && styles.inputWrapperError)}>
                        <Lock size={16} className={styles.inputIcon} aria-hidden />
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="current-password"
                            {...register('password', { required: 'Password is required' })}
                            className={styles.input}
                        />
                    </div>
                    {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Signing in...' : 'Enter Chatney'}
                </button>
            </form>
        </div>
    );
};
