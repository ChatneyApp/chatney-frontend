import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { CREATE_CHANNEL_GROUP, UPDATE_CHANNEL_GROUP } from '@/graphql/channelGroups';
import { Button } from '@/components/Button';
import { ChannelGroup } from '@/types/channelGroups';
import { useWorkspaceChannelGroupsList } from '@/contexts/WorkspaceChannelGroupsListContext';
import { useWorkspaceChannelsList } from '@/contexts/OldWorkspaceChannelsListContext';
import dialogStyles from '@/components/Popup/Popup.module.css';
import styles from './ChannelGroupForm.module.css';
import { ChannelId } from '@/types/channels';

type FormInputs = {
    name: string;
    order: number;
    channelIds: ChannelId[];
};

type Props = {
    cta: string;
    title: string;
    submitText: string;
    channelGroup?: ChannelGroup;
};

export const ChannelGroupForm = ({ cta, title, submitText, channelGroup }: Props) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { refetch, workspace } = useWorkspaceChannelGroupsList();
    const { channels } = useWorkspaceChannelsList();

    const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<FormInputs>({
        defaultValues: {
            name: channelGroup?.name ?? '',
            order: channelGroup?.order ?? 0,
            channelIds: channelGroup?.channelIds ?? [],
        }
    });

    const selectedChannels = watch('channelIds') || [];

    const [createChannelGroup, { loading: createLoading }] = useMutation(CREATE_CHANNEL_GROUP, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(t('dashboard.channelGroups.createError', { message: error.message }));
            setSuccessMessage(null);
        }
    });

    const [updateChannelGroup, { loading: updateLoading }] = useMutation(UPDATE_CHANNEL_GROUP, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(t('dashboard.channelGroups.editError', { message: error.message }));
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
        const workspaceId = workspace.id;

        if (channelGroup) {
            await updateChannelGroup({
                variables: {
                    channelGroup: {
                        id: channelGroup.id,
                        name: data.name,
                        channelIds: data.channelIds,
                        order: data.order,
                        workspaceId,
                        createdAt: channelGroup.createdAt,
                        updatedAt: channelGroup.updatedAt,
                    }
                }
            });
        } else {
            await createChannelGroup({
                variables: {
                    channelGroupDto: {
                        name: data.name,
                        channelIds: data.channelIds,
                        order: data.order,
                        workspaceId
                    }
                }
            });
        }
    };

    const handleChannelToggle = (channelId: ChannelId) => {
        const currentChannels = watch('channelIds') || [];
        let newChannels: ChannelId[];

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
                            <label htmlFor="name">{t('dashboard.channelGroups.name')}</label>
                            <input
                                id="name"
                                {...register('name', { required: t('dashboard.channelGroups.nameRequired') })}
                                className={styles.input}
                            />
                            {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="order">{t('dashboard.channelGroups.order')}</label>
                            <input
                                id="order"
                                type="number"
                                {...register('order', {
                                    required: t('dashboard.channelGroups.orderRequired'),
                                    valueAsNumber: true
                                })}
                                className={styles.input}
                            />
                            {errors.order && <span className={styles.errorText}>{errors.order.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>{t('dashboard.channelGroups.channels')}</label>
                            <div className={styles.channelsContainer}>
                                {channels.map(channel => (
                                    <div key={channel.id} className={styles.channelItem}>
                                        <input
                                            type="checkbox"
                                            id={`channel-${channel.id}`}
                                            value={channel.id}
                                            checked={selectedChannels.includes(channel.id)}
                                            onChange={() => handleChannelToggle(channel.id)}
                                        />
                                        <label htmlFor={`channel-${channel.id}`}>{channel.name}</label>
                                    </div>
                                ))}
                            </div>
                            <input
                                type="hidden"
                                {...register('channelIds')}
                            />
                        </div>

                        <div className={dialogStyles.bottomButtons}>
                            <Dialog.Close asChild>
                                <Button aria-label={t('common.close')}>
                                    {t('common.cancel')}
                                </Button>
                            </Dialog.Close>
                            <Button
                                type="submit"
                                disabled={createLoading || updateLoading}
                            >
                                {createLoading || updateLoading ? t('common.saving') : submitText}
                            </Button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
