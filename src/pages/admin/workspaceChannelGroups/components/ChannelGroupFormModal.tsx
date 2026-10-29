import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { CREATE_CHANNEL_GROUP, UPDATE_CHANNEL_GROUP } from '@/graphql/channelGroups';
import { Channel, ChannelId } from '@/types/channels';
import { ChannelGroup } from '@/types/channelGroups';
import { WorkspaceId } from '@/types/workspaces';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import styles from './ChannelGroupFormModal.module.css';

// Matches the backend's varchar(255) column.
const MAX_LENGTH = 255;

type FormInputs = {
    name: string;
    channelIds: ChannelId[];
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => void;
    workspaceId: WorkspaceId;
    channels: Channel[];
    channelGroups: ChannelGroup[];
    channelGroup?: ChannelGroup;
};

export function ChannelGroupFormModal({
    open,
    onOpenChange,
    onSaved,
    workspaceId,
    channels,
    channelGroups,
    channelGroup,
}: Props) {
    const { t } = useTranslation();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container} aria-describedby={undefined}>
                    <Dialog.Title className={styles.title}>
                        {channelGroup
                            ? t('admin.workspaceChannelGroups.form.editTitle')
                            : t('admin.workspaceChannelGroups.form.createTitle')}
                    </Dialog.Title>

                    {/* Mounted only while the dialog is open, so every opening starts a clean form. */}
                    <ChannelGroupForm
                        channelGroup={channelGroup}
                        workspaceId={workspaceId}
                        channels={channels}
                        channelGroups={channelGroups}
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
    channelGroup?: ChannelGroup;
    workspaceId: WorkspaceId;
    channels: Channel[];
    channelGroups: ChannelGroup[];
    onDone: () => void;
};

function ChannelGroupForm({ channelGroup, workspaceId, channels, channelGroups, onDone }: FormProps) {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // A channel belongs to at most one group, so the channels held by the other groups aren't offered.
    const takenChannelIds = new Set(
        channelGroups
            .filter(group => group.id !== channelGroup?.id)
            .flatMap(group => group.channelIds),
    );
    const availableChannels = channels.filter(channel => !takenChannelIds.has(channel.id));
    const availableChannelIds = new Set(availableChannels.map(channel => channel.id));

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        defaultValues: {
            name: channelGroup?.name ?? '',
            // Drops the ids of channels that were deleted since the group was saved.
            channelIds: (channelGroup?.channelIds ?? []).filter(id => availableChannelIds.has(id)),
        },
    });

    const [createChannelGroup] = useMutation(CREATE_CHANNEL_GROUP);
    const [updateChannelGroup] = useMutation(UPDATE_CHANNEL_GROUP);

    const getErrorMessage = (error: unknown) => {
        const code = getGraphQLErrorCode(error);

        if (channelGroup) {
            switch (code) {
                case FORBIDDEN_ACTION:
                    return t('admin.workspaceChannelGroups.errors.editForbidden');
                case NOT_FOUND:
                    return t('admin.workspaceChannelGroups.errors.editNotFound');
                default:
                    return t('admin.workspaceChannelGroups.errors.editFailed');
            }
        }

        switch (code) {
            case FORBIDDEN_ACTION:
                return t('admin.workspaceChannelGroups.errors.createForbidden');
            case NOT_FOUND:
                return t('admin.workspaceChannelGroups.errors.workspaceNotFound');
            default:
                return t('admin.workspaceChannelGroups.errors.createFailed');
        }
    };

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage(null);
        const name = data.name.trim();
        const selectedIds = new Set(data.channelIds);
        // `channelIds` is the display order: the channels already in the group keep their places
        // and the newly checked ones go to the end.
        const keptIds = (channelGroup?.channelIds ?? []).filter(id => selectedIds.has(id));
        const addedIds = availableChannels
            .map(channel => channel.id)
            .filter(id => selectedIds.has(id) && !keptIds.includes(id));
        const channelIds = [...keptIds, ...addedIds];

        try {
            if (channelGroup) {
                // The backend saves the whole record, so the untouched fields are sent back as they are.
                const { id, order, createdAt, updatedAt } = channelGroup;
                const result = await updateChannelGroup({
                    variables: {
                        channelGroup: { id, name, workspaceId, channelIds, order, createdAt, updatedAt },
                    },
                });

                if (!result.data?.channels.updateChannelGroup) {
                    setErrorMessage(t('admin.workspaceChannelGroups.errors.editNotFound'));
                    return;
                }
            } else {
                // New groups go after the existing ones.
                const order = Math.max(-1, ...channelGroups.map(group => group.order)) + 1;
                await createChannelGroup({ variables: { channelGroupDto: { name, workspaceId, channelIds, order } } });
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
                <label className={styles.label} htmlFor="channel-group-name">
                    {t('admin.workspaceChannelGroups.form.name')}
                </label>
                <input
                    id="channel-group-name"
                    className={styles.input}
                    autoFocus
                    autoComplete="off"
                    {...register('name', {
                        validate: {
                            required: (value) => value.trim() !== '' || t('admin.workspaceChannelGroups.form.nameRequired'),
                            maxLength: (value) =>
                                value.trim().length <= MAX_LENGTH
                                || t('admin.workspaceChannelGroups.form.tooLong', { count: MAX_LENGTH }),
                        },
                    })}
                />
                {errors.name && (
                    <span className={styles.errorText}>{errors.name.message}</span>
                )}
            </div>

            <div className={styles.field} role="group" aria-labelledby="channel-group-channels-label">
                <span id="channel-group-channels-label" className={styles.label}>
                    {t('admin.workspaceChannelGroups.form.channels')}
                </span>
                {availableChannels.length ? (
                    <Controller
                        control={control}
                        name="channelIds"
                        render={({ field }) => (
                            <div className={styles.checkboxList}>
                                {availableChannels.map((channel) => (
                                    <label key={channel.id} className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={field.value.includes(channel.id)}
                                            onChange={(event) => field.onChange(
                                                event.target.checked
                                                    ? [...field.value, channel.id]
                                                    : field.value.filter((id) => id !== channel.id),
                                            )}
                                        />
                                        {channel.name}
                                    </label>
                                ))}
                            </div>
                        )}
                    />
                ) : (
                    <span className={styles.hint}>{t('admin.workspaceChannelGroups.form.noAvailableChannels')}</span>
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
                        : channelGroup
                            ? t('common.saveChanges')
                            : t('admin.workspaceChannelGroups.create')}
                </button>
            </div>
        </form>
    );
}
