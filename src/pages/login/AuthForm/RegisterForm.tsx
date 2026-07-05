import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApolloClient } from '@apollo/client/react';
import { AtSign, Lock, User } from 'lucide-react';
import clsx from 'clsx';

import styles from './AuthForm.module.css';
import { registerUser } from '@/graphql/auth';
import { validateNickname, MAX_NICKNAME_LENGTH } from '@/helpers/nickname';

type FormInputs = {
    email: string;
    password: string;
    nickname: string;
    fullName: string;
};

export const RegisterForm = () => {
    const apollo = useApolloClient();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            email: '',
            password: '',
            nickname: '',
            fullName: '',
        },
    });

    const onSubmit = async (data: FormInputs) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            await registerUser({
                client: apollo,
                email: data.email,
                password: data.password,
                nickname: data.nickname,
                fullName: data.fullName,
            });
            window.location.href = '/login';
        } catch (error) {
            setErrorMessage(`Error registering: ${(error as Error).message}`);
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
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <div className={clsx(styles.inputWrapper, errors.email && styles.inputWrapperError)}>
                        <AtSign size={16} className={styles.inputIcon} aria-hidden />
                        <input
                            id="email"
                            type="email"
                            placeholder="name@company.com"
                            autoComplete="email"
                            {...register('email', { required: 'Email is required' })}
                            className={styles.input}
                        />
                    </div>
                    {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <div className={clsx(styles.inputWrapper, errors.password && styles.inputWrapperError)}>
                        <Lock size={16} className={styles.inputIcon} aria-hidden />
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...register('password', { required: 'Password is required' })}
                            className={styles.input}
                        />
                    </div>
                    {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="nickname" className={styles.label}>Nickname</label>
                    <div className={clsx(styles.inputWrapper, errors.nickname && styles.inputWrapperError)}>
                        <User size={16} className={styles.inputIcon} aria-hidden />
                        <input
                            id="nickname"
                            placeholder="your_nickname"
                            autoComplete="username"
                            {...register('nickname', { validate: validateNickname })}
                            maxLength={MAX_NICKNAME_LENGTH}
                            className={styles.input}
                        />
                    </div>
                    {errors.nickname && <span className={styles.errorText}>{errors.nickname.message}</span>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="fullName" className={styles.label}>Full name (optional)</label>
                    <div className={styles.inputWrapper}>
                        <User size={16} className={styles.inputIcon} aria-hidden />
                        <input
                            id="fullName"
                            placeholder="Jane Doe"
                            autoComplete="name"
                            {...register('fullName')}
                            className={styles.input}
                        />
                    </div>
                </div>

                <button type="submit" className={styles.submitButton} disabled={loading}>
                    {loading ? 'Creating account...' : 'Create account'}
                </button>
            </form>
        </div>
    );
};
