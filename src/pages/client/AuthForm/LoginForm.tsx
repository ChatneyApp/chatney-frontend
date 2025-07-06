import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useApolloClient} from '@apollo/client';

import {LOGIN} from '@/graphql/users';
import {Button} from '@/components/Button';
import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './AuthForm.module.css';
import {useNavigate} from 'react-router';

type FormInputs = {
    email: string;
    password: string;
};

export const LoginForm = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {register, handleSubmit, formState: {errors}} = useForm<FormInputs>({
        defaultValues: {
            email: '',
            password: '',
        }
    });
    const client = useApolloClient();
    const navigate = useNavigate();

    const onSubmit = async (data: FormInputs) => {
        console.log('Submitting login form:', data);
        try {
            setLoading(true);
            const response = await client.query({
                query: LOGIN,
                variables: {
                    login: data.email,
                    password: data.password,
                },
            });
            localStorage.setItem('userToken', response.data.AuthorizeUser.Token);
            localStorage.setItem('userId', response.data.AuthorizeUser.Id);
            navigate('/client/workspaces', {replace: true});
            setErrorMessage(null);
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Login failed. Please check your credentials.');
            return;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {errorMessage && <div className={styles.errorText}>{errorMessage}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Email</label>
                    <input
                        id="name"
                        type="email"
                        placeholder="Enter your email"
                        {...register('email', {required: 'Email is required'})}
                        className={styles.input}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Password</label>
                    <input
                        id="name"
                        type="password"
                        placeholder="Enter your password"
                        {...register('password', {required: 'Password is required'})}
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
