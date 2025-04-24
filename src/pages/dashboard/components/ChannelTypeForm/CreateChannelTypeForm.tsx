import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {Dialog} from 'radix-ui';

import styles from './CreateChannelTypeForm.module.css';
import dialogStyles from '@/components/Popup/Popup.module.css';
import {CREATE_CHANNEL_TYPE, EDIT_CHANNEL_TYPE} from '@/graphql/channelTypes';
import {Button} from '@/components/Button';
import {ChannelType} from '@/types/channelTypes';
import {useChannelTypesList} from '@/contexts/ChannelTypesListContext';
import {useRolesList} from '@/contexts/RolesListContext';

type FormInputs = {
    label: string;
    key: string;
    baseRoleId: string;
};

type Props = {
    cta: string;
    submitText: string;
    channelType?: ChannelType;
}

export const CreateChannelTypeForm = ({cta, submitText, channelType}: Props) => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {refetch} = useChannelTypesList();
    const {roles} = useRolesList();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormInputs>({
        defaultValues: {
            label: channelType?.Label ?? '',
            key: channelType?.Key ?? '',
            baseRoleId: channelType?.BaseRoleId ?? ''
        }
    });

    const [createChannelType, {loading: createLoading}] = useMutation(CREATE_CHANNEL_TYPE, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error creating channel type: ${error.message}`);
            setSuccessMessage(null);
        }
    });

    const [editChannelType, {loading: editLoading}] = useMutation(EDIT_CHANNEL_TYPE, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error editing channel type: ${error.message}`);
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
        if (channelType) {
            await editChannelType({
                variables: {
                    input: {
                        Label: data.label,
                        Key: data.key,
                        BaseRoleId: data.baseRoleId
                    },
                    channelTypeId: channelType.Id,
                }
            });
        } else {
            await createChannelType({
                variables: {
                    input: {
                        Label: data.label,
                        Key: data.key,
                        BaseRoleId: data.baseRoleId
                    }
                }
            });
        }
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
                    <Dialog.Title className={dialogStyles.title}>
                        {channelType ? `Edit Channel Type: ${channelType.Label}` : 'Create New Channel Type'}
                    </Dialog.Title>
                    <Dialog.Description className={dialogStyles.description}>
                        {channelType ? 'Update channel type details' : 'Create a new channel type'}
                    </Dialog.Description>

                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="label">Label</label>
                            <input
                                id="label"
                                {...register("label", {required: "Label is required"})}
                                className={styles.input}
                            />
                            {errors.label && <span className={styles.errorText}>{errors.label.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="key">Key</label>
                            <input
                                id="key"
                                {...register("key", {required: "Key is required"})}
                                className={styles.input}
                            />
                            {errors.key && <span className={styles.errorText}>{errors.key.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="baseRoleId">Base Role</label>
                            <select
                                id="baseRoleId"
                                {...register("baseRoleId", {required: "Base Role is required"})}
                                className={styles.input}
                            >
                                <option value="">Select a role</option>
                                {roles.map(role => (
                                    <option key={role.Id} value={role.Id}>
                                        {role.Name}
                                    </option>
                                ))}
                            </select>
                            {errors.baseRoleId && <span className={styles.errorText}>{errors.baseRoleId.message}</span>}
                        </div>

                        <div className={dialogStyles.bottomButtons}>
                            <Dialog.Close asChild>
                                <Button aria-label="Close">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button
                                type="submit"
                                disabled={createLoading || editLoading}
                            >
                                {createLoading || editLoading ? 'Saving...' : submitText}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}; 