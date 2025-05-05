import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {Dialog} from 'radix-ui';

import {CREATE_CHANNEL_GROUP, UPDATE_CHANNEL_GROUP} from '@/graphql/channelGroups';
import {Button} from '@/components/Button';
import {ChannelGroup} from '@/types/channelGroups';
import {useWorkspaceChannelGroupsList} from '@/contexts/WorkspaceChannelGroupsListContext';
import {useWorkspaceChannelsList} from '@/contexts/WorkspaceChannelsListContext';
import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './ChannelGroupForm.module.css';

type FormInputs = {
    name: string;
    order: number;
    channelIds: string[];
};

type Props = {
    cta: string;
    title: string;
    submitText: string;
    channelGroup?: ChannelGroup;
};

export const ChannelGroupForm = ({cta, title, submitText, channelGroup}: Props) => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {refetch, workspace} = useWorkspaceChannelGroupsList();
    const {channels} = useWorkspaceChannelsList();

    const {register, handleSubmit, reset, formState: {errors}, setValue, watch} = useForm<FormInputs>({
        defaultValues: {
            name: channelGroup?.name ?? '',
            order: channelGroup?.order ?? 0,
            channelIds: channelGroup?.channels ?? [],
        }
    });

    const selectedChannels = watch('channelIds') || [];

    const [createChannelGroup, {loading: createLoading}] = useMutation(CREATE_CHANNEL_GROUP, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error creating channel group: ${error.message}`);
            setSuccessMessage(null);
        }
    });

    const [updateChannelGroup, {loading: updateLoading}] = useMutation(UPDATE_CHANNEL_GROUP, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error updating channel group: ${error.message}`);
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
    };

    const onSubmit = async (data: FormInputs) => {
        const workspaceId = workspace.Id;

        if (channelGroup) {
            await updateChannelGroup({
                variables: {
                    input: {
                        Id: channelGroup.Id,
                        name: data.name,
                        channels: data.channelIds,
                        order: data.order,
                    }
                }
            });
        } else {
            await createChannelGroup({
                variables: {
                    input: {
                        name: data.name,
                        channels: data.channelIds,
                        order: data.order,
                        workspace: workspaceId
                    }
                }
            });
        }
    };

    const handleChannelToggle = (channelId: string) => {
        const currentChannels = watch('channelIds') || [];
        let newChannels: string[];

        if (currentChannels.includes(channelId)) {
            newChannels = currentChannels.filter(id => id !== channelId);
        } else {
            newChannels = [...currentChannels, channelId];
        }

        setValue('channelIds', newChannels);
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
                            <label htmlFor="name">Channel Group Name</label>
                            <input
                                id="name"
                                {...register("name", {required: "Channel group name is required"})}
                                className={styles.input}
                            />
                            {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="order">Display Order</label>
                            <input
                                id="order"
                                type="number"
                                {...register("order", {
                                    required: "Order is required",
                                    valueAsNumber: true
                                })}
                                className={styles.input}
                            />
                            {errors.order && <span className={styles.errorText}>{errors.order.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Channels</label>
                            <div className={styles.channelsContainer}>
                                {channels.map(channel => (
                                    <div key={channel.Id} className={styles.channelItem}>
                                        <input
                                            type="checkbox"
                                            id={`channel-${channel.Id}`}
                                            value={channel.Id}
                                            checked={selectedChannels.includes(channel.Id)}
                                            onChange={() => handleChannelToggle(channel.Id)}
                                        />
                                        <label htmlFor={`channel-${channel.Id}`}>{channel.Name}</label>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="hidden"
                                {...register("channelIds")}
                            />
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
