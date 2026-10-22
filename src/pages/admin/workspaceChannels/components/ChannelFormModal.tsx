import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { CREATE_CHANNEL, UPDATE_CHANNEL } from '@/graphql/channels';
import { Channel } from '@/types/channels';
import { ChannelType } from '@/types/channelTypes';
import { WorkspaceId } from '@/types/workspaces';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import styles from './ChannelFormModal.module.css';

// Matches the backend's varchar(255) column.
const MAX_LENGTH = 255;

type FormInputs = {
    name: string;
    channelTypeId: number;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => void;
    workspaceId: WorkspaceId;
    channelTypes: ChannelType[];
    channel?: Channel;
};

export function ChannelFormModal({ open, onOpenChange, onSaved, workspaceId, channelTypes, channel }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container} aria-describedby={undefined}>
                    <Dialog.Title className={styles.title}>
                        {channel ? t('admin.workspaceChannels.form.editTitle') : t('admin.workspaceChannels.form.createTitle')}
                    </Dialog.Title>

                    {/* Mounted only while the dialog is open, so every opening starts a clean form. */}
                    <ChannelForm
                        channel={channel}
                        workspaceId={workspaceId}
                        channelTypes={channelTypes}
                        onDone={() => {
                            onSaved();
                            onOpenChange(false);
                        }}
                    />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

type FormProps = {
    channel?: Channel;
    workspaceId: WorkspaceId;
    channelTypes: ChannelType[];
    onDone: () => void;
};

function ChannelForm({ channel, workspaceId, channelTypes, onDone }: FormProps) {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        defaultValues: {
            name: channel?.name ?? '',
            channelTypeId: channel?.channelTypeId ?? channelTypes[0]?.id,
        },
    });

    const [createChannel] = useMutation(CREATE_CHANNEL);
    const [updateChannel] = useMutation(UPDATE_CHANNEL);

    const getErrorMessage = (error: unknown) => {
        const code = getGraphQLErrorCode(error);

        if (channel) {
            switch (code) {
                case FORBIDDEN_ACTION:
                    return t('admin.workspaceChannels.errors.editForbidden');
                case NOT_FOUND:
                    return t('admin.workspaceChannels.errors.editNotFound');
                default:
                    return t('admin.workspaceChannels.errors.editFailed');
            }
        }

        switch (code) {
            case FORBIDDEN_ACTION:
                return t('admin.workspaceChannels.errors.createForbidden');
            case NOT_FOUND:
                return t('admin.workspaceChannels.errors.workspaceNotFound');
            default:
                return t('admin.workspaceChannels.errors.createFailed');
        }
    };

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage(null);
        const name = data.name.trim();
        const { channelTypeId } = data;

        try {
            if (channel) {
                // The backend saves the whole record, so the untouched fields are sent back as they are.
                const { id, isDm, secObjId, createdAt, updatedAt } = channel;
                const result = await updateChannel({
                    variables: {
                        channel: { id, name, channelTypeId, workspaceId, isDm, secObjId, createdAt, updatedAt },
                    },
                });

                if (!result.data?.channels.updateChannel) {
                    setErrorMessage(t('admin.workspaceChannels.errors.editNotFound'));
                    return;
                }
            } else {
                await createChannel({ variables: { channelDto: { name, channelTypeId, workspaceId } } });
            }
        } catch (error) {
            setErrorMessage(getErrorMessage(error));
            return;
        }

        onDone();
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="channel-name">
                    {t('admin.workspaceChannels.form.name')}
                </label>
                <input
                    id="channel-name"
                    className={styles.input}
                    autoFocus
                    autoComplete="off"
                    {...register('name', {
                        validate: {
                            required: (value) => value.trim() !== '' || t('admin.workspaceChannels.form.nameRequired'),
                            maxLength: (value) =>
                                value.trim().length <= MAX_LENGTH
                                || t('admin.workspaceChannels.form.tooLong', { count: MAX_LENGTH }),
                        },
                    })}
                />
                {errors.name && (
                    <span className={styles.errorText}>{errors.name.message}</span>
                )}
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="channel-type">
                    {t('admin.workspaceChannels.form.type')}
                </label>
                <select
                    id="channel-type"
                    className={styles.select}
                    {...register('channelTypeId', {
                        valueAsNumber: true,
                        validate: (value) => Number.isInteger(value) || t('admin.workspaceChannels.form.typeRequired'),
                    })}
                >
                    {channelTypes.map(channelType => (
                        <option key={channelType.id} value={channelType.id}>
                            {channelType.name}
                        </option>
                    ))}
                </select>
                {errors.channelTypeId && (
                    <span className={styles.errorText}>{errors.channelTypeId.message}</span>
                )}
            </div>

            {errorMessage && (
                <div role="alert" className={styles.errorMessage}>{errorMessage}</div>
            )}

            <div className={styles.bottomButtons}>
                <Dialog.Close asChild>
                    <button type="button" className={styles.cancelButton}>
                        {t('common.cancel')}
                    </button>
                </Dialog.Close>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? t('common.saving')
                        : channel
                            ? t('common.saveChanges')
                            : t('admin.workspaceChannels.create')}
                </button>
            </div>
        </form>
    );
}
