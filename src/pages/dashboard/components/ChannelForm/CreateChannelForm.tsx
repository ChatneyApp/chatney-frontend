import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {Dialog} from 'radix-ui';

import styles from './CreateChannelForm.module.css';
import dialogStyles from '@/components/Popup/Popup.module.css';
import {CREATE_CHANNEL, UPDATE_CHANNEL} from '@/graphql/channels';
import {Button} from '@/components/Button';
import {Channel} from '@/types/channels';
import {useWorkspaceChannelsList} from '@/contexts/WorkspaceChannelsListContext';
import {useChannelTypesList} from '@/contexts/ChannelTypesListContext';

type FormInputs = {
    name: string;
    channelTypeId: string;
};

type Props = {
    cta: string;
    title: string;
    submitText: string;
    channel?: Channel;
};

export const CreateChannelForm = ({cta, title, submitText, channel}: Props) => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {refetch, workspace} = useWorkspaceChannelsList();
    const {channelTypes} = useChannelTypesList();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormInputs>({
        defaultValues: {
            name: channel?.Name ?? '',
            channelTypeId: channel?.ChannelTypeId ?? '',
        }
    });

    const [createChannel, {loading: createLoading}] = useMutation(CREATE_CHANNEL, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error creating channel: ${error.message}`);
            setSuccessMessage(null);
        }
    });

    const [updateChannel, {loading: updateLoading}] = useMutation(UPDATE_CHANNEL, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error updating channel: ${error.message}`);
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
        const workspaceId = workspace.Id;

        if (channel) {
            await updateChannel({
                variables: {
                    channelId: channel.Id,
                    input: {
                        Name: data.name,
                        ChannelTypeId: data.channelTypeId,
                        WorkspaceId: workspaceId
                    }
                }
            });
        } else {
            await createChannel({
                variables: {
                    input: {
                        Name: data.name,
                        ChannelTypeId: data.channelTypeId,
                        WorkspaceId: workspaceId
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
                    <Dialog.Title className={dialogStyles.title}>{title}</Dialog.Title>

                    {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Channel Name</label>
                            <input
                                id="name"
                                {...register('name', {required: 'Channel name is required'})}
                                className={styles.input}
                            />
                            {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="channelTypeId">Channel Type</label>
                            <select
                                id="channelTypeId"
                                {...register('channelTypeId', {required: 'Channel type is required'})}
                                className={styles.select}
                            >
                                <option value="">Select a channel type</option>
                                {channelTypes.map(type => (
                                    <option key={type.Id} value={type.Id}>
                                        {type.Label}
                                    </option>
                                ))}
                            </select>
                            {errors.channelTypeId && <span className={styles.errorText}>{errors.channelTypeId.message}</span>}
                        </div>

                        <div className={dialogStyles.bottomButtons}>
                            <Dialog.Close asChild>
                                <Button aria-label="Close">
                                    Cancel
                                </Button>
                            </Dialog.Close>
                            <Button
                                type="submit"
                                disabled={createLoading || updateLoading}
                            >
                                {createLoading || updateLoading ? 'Saving...' : submitText}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
