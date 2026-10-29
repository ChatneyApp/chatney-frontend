import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { CREATE_CHANNEL_TYPE, EDIT_CHANNEL_TYPE } from '@/graphql/channelTypes';
import { ChannelType } from '@/types/channelTypes';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import styles from './ChannelTypeFormModal.module.css';

// Matches the backend's varchar(255) columns.
const MAX_LENGTH = 255;
const KEY_PATTERN = /^[A-Za-z0-9_-]+$/;

type FormInputs = {
    name: string;
    key: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => void;
    channelType?: ChannelType;
};

export function ChannelTypeFormModal({ open, onOpenChange, onSaved, channelType }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container} aria-describedby={undefined}>
                    <Dialog.Title className={styles.title}>
                        {channelType ? t('admin.channelTypes.form.editTitle') : t('admin.channelTypes.form.createTitle')}
                    </Dialog.Title>

                    {/* Mounted only while the dialog is open, so every opening starts a clean form. */}
                    <ChannelTypeForm
                        channelType={channelType}
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
    channelType?: ChannelType;
    onDone: () => void;
};

function ChannelTypeForm({ channelType, onDone }: FormProps) {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        defaultValues: {
            name: channelType?.name ?? '',
            key: channelType?.key ?? '',
        },
    });

    const [createChannelType] = useMutation(CREATE_CHANNEL_TYPE);
    const [editChannelType] = useMutation(EDIT_CHANNEL_TYPE);

    const getErrorMessage = (error: unknown) => {
        const code = getGraphQLErrorCode(error);

        if (channelType) {
            switch (code) {
                case FORBIDDEN_ACTION:
                    return t('admin.channelTypes.errors.editForbidden');
                case NOT_FOUND:
                    return t('admin.channelTypes.errors.editNotFound');
                default:
                    return t('admin.channelTypes.errors.editFailed');
            }
        }

        return code === FORBIDDEN_ACTION
            ? t('admin.channelTypes.errors.createForbidden')
            : t('admin.channelTypes.errors.createFailed');
    };

    const validateMaxLength = (value: string) =>
        value.trim().length <= MAX_LENGTH || t('admin.channelTypes.form.tooLong', { count: MAX_LENGTH });

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage(null);
        const name = data.name.trim();
        const key = data.key.trim();

        try {
            if (channelType) {
                // The backend saves the whole record, so the untouched fields are sent back as they are.
                const { id, secObjId, createdAt, updatedAt } = channelType;
                const result = await editChannelType({
                    variables: { channelType: { id, name, key, secObjId, createdAt, updatedAt } },
                });

                if (!result.data?.channels.updateChannelType) {
                    setErrorMessage(t('admin.channelTypes.errors.editNotFound'));
                    return;
                }
            } else {
                await createChannelType({ variables: { channelTypeDto: { name, key } } });
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
                <label className={styles.label} htmlFor="channel-type-name">
                    {t('admin.channelTypes.form.name')}
                </label>
                <input
                    id="channel-type-name"
                    className={styles.input}
                    autoFocus
                    {...register('name', {
                        validate: {
                            required: (value) => value.trim() !== '' || t('admin.channelTypes.form.nameRequired'),
                            maxLength: validateMaxLength,
                        },
                    })}
                />
                {errors.name && (
                    <span className={styles.errorText}>{errors.name.message}</span>
                )}
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="channel-type-key">
                    {t('admin.channelTypes.form.key')}
                </label>
                <input
                    id="channel-type-key"
                    className={styles.input}
                    autoComplete="off"
                    spellCheck={false}
                    {...register('key', {
                        validate: {
                            required: (value) => value.trim() !== '' || t('admin.channelTypes.form.keyRequired'),
                            pattern: (value) => KEY_PATTERN.test(value.trim()) || t('admin.channelTypes.form.keyInvalid'),
                            maxLength: validateMaxLength,
                        },
                    })}
                />
                {errors.key && (
                    <span className={styles.errorText}>{errors.key.message}</span>
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
                        : channelType
                            ? t('common.saveChanges')
                            : t('admin.channelTypes.create')}
                </button>
            </div>
        </form>
    );
}
