import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client/react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { AddWorkspaceMutation, UPDATE_WORKSPACE } from '@/graphql/workspaces';
import { Workspace } from '@/types/workspaces';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import styles from './WorkspaceFormModal.module.css';

type FormInputs = {
    name: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSaved: () => void;
    workspace?: Workspace;
};

export function WorkspaceFormModal({ open, onOpenChange, onSaved, workspace }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container} aria-describedby={undefined}>
                    <Dialog.Title className={styles.title}>
                        {workspace ? t('admin.workspaces.form.editTitle') : t('admin.workspaces.form.createTitle')}
                    </Dialog.Title>

                    {/* Mounted only while the dialog is open, so every opening starts a clean form. */}
                    <WorkspaceForm
                        workspace={workspace}
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
    workspace?: Workspace;
    onDone: () => void;
};

function WorkspaceForm({ workspace, onDone }: FormProps) {
    const { t } = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        defaultValues: {
            name: workspace?.name ?? '',
        },
    });

    const [addWorkspace] = useMutation(AddWorkspaceMutation);
    const [updateWorkspace] = useMutation(UPDATE_WORKSPACE);

    const getErrorMessage = (error: unknown) => {
        const code = getGraphQLErrorCode(error);

        if (workspace) {
            switch (code) {
                case FORBIDDEN_ACTION:
                    return t('admin.workspaces.errors.editForbidden');
                case NOT_FOUND:
                    return t('admin.workspaces.errors.editNotFound');
                default:
                    return t('admin.workspaces.errors.editFailed');
            }
        }

        return code === FORBIDDEN_ACTION
            ? t('admin.workspaces.errors.createForbidden')
            : t('admin.workspaces.errors.createFailed');
    };

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage(null);
        const name = data.name.trim();

        try {
            if (workspace) {
                // The backend saves the whole record, so the untouched fields are sent back as they are.
                const { id, secObjId, createdAt, updatedAt } = workspace;
                const result = await updateWorkspace({
                    variables: { workspace: { id, name, secObjId, createdAt, updatedAt } },
                });

                if (!result.data?.workspaces.updateWorkspace) {
                    setErrorMessage(t('admin.workspaces.errors.editNotFound'));
                    return;
                }
            } else {
                await addWorkspace({ variables: { name } });
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
                <label className={styles.label} htmlFor="workspace-name">
                    {t('admin.workspaces.form.name')}
                </label>
                <input
                    id="workspace-name"
                    className={styles.input}
                    autoFocus
                    {...register('name', {
                        validate: (value) => value.trim() !== '' || t('admin.workspaces.form.nameRequired'),
                    })}
                />
                {errors.name && (
                    <span className={styles.errorText}>{errors.name.message}</span>
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
                        : workspace
                            ? t('common.saveChanges')
                            : t('admin.workspaces.create')}
                </button>
            </div>
        </form>
    );
}
