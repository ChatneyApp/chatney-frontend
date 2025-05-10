import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/client';

import {LOGIN} from '@/graphql/users';
import {Button} from '@/components/Button';
import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from '@/pages/client/AuthForm/AuthForm.module.css';

type FormInputs = {
    email: string;
    password: string;
};

export const LoginForm = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormInputs>({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const [doLogin, {loading}] = useMutation(LOGIN, {
        onCompleted: () => {
            reset();
        },
        onError: (error) => {
            setErrorMessage(`Login error: ${error.message}`);
            setSuccessMessage(null);
        }
    });


    const onSubmit = async (data: FormInputs) => {
        await doLogin({
            variables: {
                input: {
                    email: data.email,
                    password: data.password,
                }
            }
        });
    };


    return (
        <div>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={styles.formGroup}>
                    <label htmlFor="name" className={styles.label}>Email</label>
                    <input
                        id="name"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email", {required: "Email is required"})}
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
                        {...register("password", {required: "Password is required"})}
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
