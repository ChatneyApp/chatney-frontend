import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApolloClient, useMutation } from '@apollo/client';

import { Button } from '@/components/Button';
import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './AuthForm.module.css';
import { registerUser } from './auth.gql';

type FormInputs = {
    email: string;
    password: string;
    username: string;
};

export const RegisterForm = () => {
    const apollo = useApolloClient();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            email: '',
            password: '',
            username: '',
        }
    });

    const onSubmit = async (data: FormInputs) => {
        setLoading(true);
        try {
            await registerUser({
                client: apollo,
                email: data.email,
                password: data.password,
                username: data.username,
            });
            reset();
        } catch (error: any) {
            setErrorMessage(`Error registering: ${error.message}`);
            setSuccessMessage(null);
        }

        setLoading(false);
    };

    return (
        <div>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register('email', { required: 'Email is required' })}
                        className={styles.input}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        {...register('password', { required: 'Password is required' })}
                        className={styles.input}
                    />
                    {errors.password && <span className={styles.errorText}>{errors.password.message}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="username" className={styles.label}>Username</label>
                    <input
                        id="username"
                        placeholder='Enter your username'
                        {...register('username', { required: 'Username is required' })}
                        className={styles.input}
                    />
                    {errors.username && <span className={styles.errorText}>{errors.username.message}</span>}
                </div>

                <div className={dialogStyles.bottomButtons}>
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
