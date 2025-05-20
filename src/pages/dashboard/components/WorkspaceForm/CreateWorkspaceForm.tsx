import {useForm} from 'react-hook-form';
import {useMutation} from '@apollo/client';
import {useState} from 'react';
import {Dialog} from 'radix-ui';

import styles from './CreateWorkspaceForm.module.css';
import dialogStyles from '@/components/Popup/Popup.module.css';
import {CREATE_WORKSPACE, UPDATE_WORKSPACE} from '@/graphql/workspaces';
import {Button} from '@/components/Button';
import {Workspace} from '@/types/workspaces';
import {useWorkspacesList} from '@/contexts/WorkspacesListContext';

type FormInputs = {
    name: string;
};

type Props = {
    cta: string;
    title: string;
    submitText: string;
    workspace?: Workspace;
}

export const CreateWorkspaceForm = ({cta, title, submitText, workspace}: Props) => {
    const [open, setOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {refetch} = useWorkspacesList();

    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormInputs>({
        defaultValues: {
            name: workspace?.Name ?? '',
        }
    });

    const [createWorkspace, {loading: createLoading}] = useMutation(CREATE_WORKSPACE, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error creating workspace: ${error.message}`);
            setSuccessMessage(null);
        }
    });

    const [updateWorkspace, {loading: updateLoading}] = useMutation(UPDATE_WORKSPACE, {
        onCompleted: () => {
            setOpen(false);
            reset();
            refetch();
        },
        onError: (error) => {
            setErrorMessage(`Error updating workspace: ${error.message}`);
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
        if (workspace) {
            await updateWorkspace({
                variables: {
                    workspaceId: workspace.Id,
                    input: {
                        Name: data.name
                    }
                }
            });
        } else {
            await createWorkspace({
                variables: {
                    input: {
                        Name: data.name
                    }
                }
            });
        }
    };

    return (
        <Dialog.Root open={open} onOpenChange={handleOpenChange}>
            <Dialog.Trigger asChild>
                <Button>{cta}</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={dialogStyles.overlay}/>
                <Dialog.Content className={dialogStyles.container}>
                    <Dialog.Title className={dialogStyles.title}>
                        {title}
                    </Dialog.Title>
                    <div className={styles.formContainer}>
                        {successMessage && (
                            <div className={styles.successMessage}>{successMessage}</div>
                        )}
                        {errorMessage && (
                            <div className={styles.errorMessage}>{errorMessage}</div>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Workspace Name</label>
                                <input
                                    id="name"
                                    {...register('name', {required: 'Workspace name is required'})}
                                    className={styles.input}
                                />
                                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
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
                                    {createLoading || updateLoading ? 'Processing...' : submitText}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
