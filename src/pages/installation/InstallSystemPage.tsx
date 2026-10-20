import { installSystem } from '@/graphql/systemConfig';
import { clientStartPageUrl } from '@/infra/consts';
import { useApolloClient } from '@apollo/client/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styles from './Form.module.css';

export const InstallSystemPage = () => {
    const { t } = useTranslation();
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
            setErrorMessage(t('install.error', { message: (error as Error).message }));
        }

        setLoading(false);
    };

    return <div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.formGroup}>
                <button className={`${styles.input} cursor-pointer`}>
                    {t('install.submit')}</button>
            </div>
        </form>
        <p>{t('install.loading')} {loading}</p>
        <p className={styles.errorText}>{t('install.errorMessage')} {errorMessage}</p>
    </div>
}
