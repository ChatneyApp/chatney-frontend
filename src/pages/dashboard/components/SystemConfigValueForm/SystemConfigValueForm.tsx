import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import styles from './SystemConfigValueForm.module.css';
import dialogStyles from '@/components/Popup/Popup.module.css';
import { UPDATE_SYSTEM_CONFIG_VALUE } from '@/graphql/systemConfig';
import { Button } from '@/components/Button';
import { SystemConfigValue } from '@/types/systemConfig';
import { useSystemConfig } from '@/contexts/SystemConfigProvider';

type FormInputs = {
    value: string;
};

type Props = {
    cta: string;
    title: string;
    submitText: string;
    systemConfigValue: SystemConfigValue;
};

export const SystemConfigValueForm = ({ cta, title, submitText, systemConfigValue }: Props) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { refetch } = useSystemConfig();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            value: systemConfigValue.value,
        }
    });

    const [updateValue, { loading }] = useMutation(UPDATE_SYSTEM_CONFIG_VALUE, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(t('dashboard.config.editError', { message: error.message }));
            setSuccessMessage(null);
        }
    });

    const handleOpenChange = (open: boolean) => {
        setOpen(open);
        if (!open) {
            reset();
            setSuccessMessage(null);
            setErrorMessage(null);
        }
    }

    const onSubmit = async (data: FormInputs) => {
        await updateValue({
            variables: {
                config: {
                    id: systemConfigValue.id,
                    name: systemConfigValue.name,
                    value: data.value,
                    type: systemConfigValue.type,
                }
            }
        });
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <Button>
                    {cta}
                </Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={dialogStyles.overlay}/>
                <Dialog.Content className={dialogStyles.container}>
                    <Dialog.Title className={dialogStyles.title}>{title}</Dialog.Title>

                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="value">{t('dashboard.config.value')}</label>
                            <input
                                id="value"
                                {...register('value', { required: t('dashboard.config.valueRequired') })}
                                className={styles.input}
                            />
                            {errors.value && <span className={styles.errorText}>{errors.value.message}</span>}
                        </div>

                        <div className={dialogStyles.bottomButtons}>
                            <Dialog.Close asChild>
                                <Button aria-label={t('common.close')}>
                                    {t('common.cancel')}
                                </Button>
                            </Dialog.Close>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? t('common.saving') : submitText}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
