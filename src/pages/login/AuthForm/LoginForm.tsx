import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useApolloClient } from '@apollo/client';
import { Button } from '@/components/Button';
import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './AuthForm.module.css';
import { clientStartPageUrl, userAuthTokenName, userAuthId } from '@/infra/consts';
import { loginUser } from './auth.gql';

type FormInputs = {
    login: string;
    password: string;
};

export const LoginForm = () => {
    const apollo = useApolloClient();
    const [ loading, setLoading ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            login: '',
            password: '',
        }
    });

    const onSubmit = async (data: FormInputs) => {
        console.log("Form data:", data);
        setLoading(true);

        try {
            const out = await loginUser({
                client: apollo,
                login: data.login,
                password: data.password,
            });

            localStorage.setItem(userAuthTokenName, out.token);
            localStorage.setItem(userAuthId, out.id);
            window.location.href = clientStartPageUrl;
        } catch (error) {
            setErrorMessage(`Login error: ${(error as Error).message}`);
        }

        setLoading(false);
    };

    return (
        <div>
            {errorMessage && <div className={styles.errorText}>{errorMessage}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label htmlFor="login" className={styles.label}>Email</label>
                    <input
                        id="login"
                        type="email"
                        placeholder="Enter your email"
                        {...register('login', { required: 'Email is required' })}
                        className={styles.input}
                    />
                    {errors.login && <span className={styles.errorText}>{errors.login.message}</span>}
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

                <div className={dialogStyles.bottomButtons}>
                    <Button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </div>
            </form>
        </div>
    );
};
