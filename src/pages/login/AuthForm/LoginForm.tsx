import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';

import { LOGIN } from '@/graphql/users';
import { Button } from '@/components/Button';
import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './AuthForm.module.css';
import { userAuthTokenName, userAuthId } from '@/infra/consts';

type FormInputs = {
    login: string;
    password: string;
};

export const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            login: '',
            password: '',
        }
    });

    const [doLogin, { loading }] = useMutation(LOGIN, {
        onCompleted: (data) => {
            localStorage.setItem(userAuthTokenName, data.users.login.token);
            localStorage.setItem(userAuthId, data.users.login.id);
            window.location.href = '/'
        },
        onError: (error) => {
            setErrorMessage(`Login error: ${error.message}`);
        },
    });


    const onSubmit = async (data: FormInputs) => {
        console.log("Form data:", data);

        await doLogin({
            variables: {
                login: data.login,
                password: data.password,
            }
        });
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
