import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {Dialog} from 'radix-ui';

import styles from './SystemConfigValueForm.module.css';
import dialogStyles from '@/components/Popup/Popup.module.css';
import {UDPATE_SYSTEM_CONFIG_VALUE} from '@/graphql/systemConfig';
import {Button} from '@/components/Button';
import {SystemConfigValue} from '@/types/systemConfig';
import {useSystemConfig} from '@/contexts/SystemConfigProvider';

type FormInputs = {
    value: string;
};

type Props = {
    cta: string;
    title: string;
    submitText: string;
    systemConfigValue: SystemConfigValue;
};

export const SystemConfigValueForm = ({cta, title, submitText, systemConfigValue}: Props) => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {refetch} = useSystemConfig();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormInputs>({
        defaultValues: {
            value: systemConfigValue.Value,
        }
    });

    const [updateValue, {loading}] = useMutation(UDPATE_SYSTEM_CONFIG_VALUE, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error updating value: ${error.message}`);
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
                configName: systemConfigValue.Name,
                configValue: data.value,
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
                            <label htmlFor="value">Value</label>
                            <input
                                id="value"
                                {...register('value', {required: 'Value is required'})}
                                className={styles.input}
                            />
                            {errors.value && <span className={styles.errorText}>{errors.value.message}</span>}
                        </div>

                        <div className={dialogStyles.bottomButtons}>
                            <Dialog.Close asChild>
                                <Button aria-label="Close">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : submitText}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
