import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import styles from './CreateChannelForm.module.css';
import dialogStyles from '@/components/Popup/Popup.module.css';
import { addChannelToCache, CREATE_CHANNEL, UPDATE_CHANNEL } from '@/graphql/channels';
import { Button } from '@/components/Button';
import { Channel } from '@/types/channels';
import { useWorkspaceChannelsList } from '@/contexts/OldWorkspaceChannelsListContext';
import { useChannelTypesList } from '@/contexts/ChannelTypesListContext';
import { ChannelTypeId } from '@/types/channelTypes';

type FormInputs = {
    name: string;
    channelTypeId: ChannelTypeId;
};

type Props = {
    cta: string;
    title: string;
    submitText: string;
    channel?: Channel;
};

export const CreateChannelForm = ({ cta, title, submitText, channel }: Props) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { workspace } = useWorkspaceChannelsList();
    const { channelTypes } = useChannelTypesList();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormInputs>({
        defaultValues: {
            name: channel?.name ?? '',
            channelTypeId: channel?.channelTypeId ?? 0,
        }
    });

    const [createChannel, { loading: createLoading }] = useMutation(CREATE_CHANNEL, {
        update: (cache, { data }) => {
            if (data) {
                addChannelToCache(cache, data.channels.addChannel);
            }
        },
        onCompleted: () => {
            setOpen(false);
            reset();
        },
        onError: (error) => {
            setErrorMessage(t('dashboard.channels.createError', { message: error.message }));
            setSuccessMessage(null);
        }
    });

    // No cache update needed: the mutation returns the channel with its id, so Apollo updates the cached entity itself.
    const [updateChannel, { loading: updateLoading }] = useMutation(UPDATE_CHANNEL, {
        onCompleted: () => {
            setOpen(false);
            reset();
        },
        onError: (error) => {
            setErrorMessage(t('dashboard.channels.editError', { message: error.message }));
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
        const workspaceId = workspace.id;

        if (channel) {
            await updateChannel({
                variables: {
                    channel: {
                        id: channel.id,
                        name: data.name,
                        channelTypeId: data.channelTypeId,
                        workspaceId: workspaceId,
                        isDm: channel.isDm,
                        secObjId: channel.secObjId,
                        createdAt: channel.createdAt,
                        updatedAt: channel.updatedAt,
                    }
                }
            });
        } else {
            await createChannel({
                variables: {
                    channelDto: {
                        name: data.name,
                        channelTypeId: data.channelTypeId,
                        workspaceId: workspaceId
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
                            <label htmlFor="name">{t('dashboard.channels.name')}</label>
                            <input
                                id="name"
                                {...register('name', { required: t('dashboard.channels.nameRequired') })}
                                className={styles.input}
                            />
                            {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="channelTypeId">{t('dashboard.channels.channelType')}</label>
                            <select
                                id="channelTypeId"
                                {...register('channelTypeId', { required: t('dashboard.channels.channelTypeRequired') })}
                                className={styles.select}
                            >
                                <option value="">{t('dashboard.channels.selectChannelType')}</option>
                                {channelTypes.filter(type => type.key !== 'dm').map(type => (
                                    <option key={type.id} value={type.id}>
                                        {type.name}
                                    </option>
                                ))}
                            </select>
                            {errors.channelTypeId && <span className={styles.errorText}>{errors.channelTypeId.message}</span>}
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
