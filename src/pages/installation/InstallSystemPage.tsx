import { installSystem } from '@/graphql/systemConfig';
import { clientStartPageUrl } from '@/infra/consts';
import { useApolloClient } from '@apollo/client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './Form.module.css';

export const InstallSystemPage = () => {
    const apollo = useApolloClient();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { handleSubmit } = useForm();

    const onSubmit = async () => {
        setLoading(true);

        try {
            await installSystem(apollo);
            window.location.href = clientStartPageUrl;
        } catch (error) {
            setErrorMessage(`System install error: ${(error as Error).message}`);
        }

        setLoading(false);
    };

    return <div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
                <button className={`${styles.input} cursor-pointer`}>
                    Install</button>
            </div>
        </form>
        <p>Loading: {loading}</p>
        <p className={styles.errorText}>Error message: {errorMessage}</p>
    </div>
}