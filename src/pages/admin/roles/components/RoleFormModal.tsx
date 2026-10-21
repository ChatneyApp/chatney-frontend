import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { skipToken, useMutation, useQuery } from '@apollo/client/react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';

import { CREATE_ROLE, EDIT_ROLE } from '@/graphql/roles';
import { DELETE_ROLE_ACL, GET_ROLE_ACLS, GET_SECURE_OBJECTS, SET_ROLE_ACL } from '@/graphql/acls';
import { GET_PERMISSIONS_LIST } from '@/graphql/permissions';
import { useRolesList } from '@/contexts/RolesListContext';
import { Role, RoleId } from '@/types/roles';
import { PermissionGroup } from '@/types/acls';
import { diffRoleAcls, RoleAclDraft } from '@/helpers/roleAcls';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';

import { RolePermissionsEditor } from './RolePermissionsEditor';
import { listSecureObjects, SecureObjectEntry, sortRoleAclDrafts } from './secureObjects';
import styles from './RoleFormModal.module.css';

type FormInputs = {
    name: string;
    acls: RoleAclDraft[];
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    role?: Role;
};

export function RoleFormModal({ open, onOpenChange, role }: Props) {
    const { t } = useTranslation();

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className={styles.overlay} />
                <Dialog.Content className={styles.container}>
                    <Dialog.Title className={styles.title}>
                        {role ? t('admin.roles.form.editTitle') : t('admin.roles.form.createTitle')}
                    </Dialog.Title>

                    {/* Mounted only while the dialog is open, so every opening loads fresh ACLs and starts a clean form. */}
                    <RoleFormLoader role={role} onDone={() => onOpenChange(false)} />
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

type LoaderProps = {
    role?: Role;
    onDone: () => void;
};

function RoleFormLoader({ role, onDone }: LoaderProps) {
    const { t } = useTranslation();
    const secureObjectsQuery = useQuery(GET_SECURE_OBJECTS, { fetchPolicy: 'network-only' });
    const permissionsQuery = useQuery(GET_PERMISSIONS_LIST);
    const roleAclsQuery = useQuery(
        GET_ROLE_ACLS,
        role ? { variables: { roleId: role.id }, fetchPolicy: 'network-only' } : skipToken,
    );

    const secureObjects = useMemo(
        () => secureObjectsQuery.data ? listSecureObjects(secureObjectsQuery.data.acls.secureObjects, t) : null,
        [secureObjectsQuery.data, t],
    );

    const initialAcls = useMemo(() => {
        if (!secureObjects || (role && !roleAclsQuery.data)) {
            return null;
        }

        const acls = (roleAclsQuery.data?.acls.roleAcls ?? []).map(({ secObjId, permissions }) => ({ secObjId, permissions }));
        return sortRoleAclDrafts(acls, secureObjects);
    }, [role, roleAclsQuery.data, secureObjects]);

    const loadError = secureObjectsQuery.error ?? permissionsQuery.error ?? roleAclsQuery.error;

    if (loadError) {
        return (
            <div className={styles.form}>
                <div role="alert" className={styles.errorMessage}>
                    {getGraphQLErrorCode(loadError) === FORBIDDEN_ACTION
                        ? t('admin.roles.errors.permissionsLoadForbidden')
                        : t('admin.roles.errors.permissionsLoadFailed')}
                </div>
                <div className={styles.bottomButtons}>
                    <Dialog.Close asChild>
                        <button type="button" className={styles.cancelButton}>
                            {t('common.close')}
                        </button>
                    </Dialog.Close>
                </div>
            </div>
        );
    }

    if (!secureObjects || !permissionsQuery.data || !initialAcls) {
        return <div className={styles.loading}>{t('admin.roles.form.loading')}</div>;
    }

    return (
        <RoleForm
            role={role}
            initialAcls={initialAcls}
            secureObjects={secureObjects}
            permissionGroups={permissionsQuery.data.permissions.list}
            onDone={onDone}
        />
    );
}

type FormProps = {
    role?: Role;
    initialAcls: RoleAclDraft[];
    secureObjects: SecureObjectEntry[];
    permissionGroups: PermissionGroup[];
    onDone: () => void;
};

function RoleForm({ role, initialAcls, secureObjects, permissionGroups, onDone }: FormProps) {
    const { t } = useTranslation();
    const { refetch } = useRolesList();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // Set once a new role is created, so retrying after its ACLs failed updates it instead of creating another one.
    const [createdRoleId, setCreatedRoleId] = useState<RoleId | null>(null);
    const isEditing = Boolean(role);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormInputs>({
        defaultValues: {
            name: role?.name ?? '',
            acls: initialAcls,
        },
    });

    const [createRole] = useMutation(CREATE_ROLE);
    const [editRole] = useMutation(EDIT_ROLE);
    const [setRoleAcl] = useMutation(SET_ROLE_ACL);
    const [deleteRoleAcl] = useMutation(DELETE_ROLE_ACL);

    const getRoleErrorMessage = (error: unknown, editing: boolean) => {
        const code = getGraphQLErrorCode(error);

        if (editing) {
            switch (code) {
                case FORBIDDEN_ACTION:
                    return t('admin.roles.errors.editForbidden');
                case NOT_FOUND:
                    return t('admin.roles.errors.editNotFound');
                default:
                    return t('admin.roles.errors.editFailed');
            }
        }

        return code === FORBIDDEN_ACTION
            ? t('admin.roles.errors.createForbidden')
            : t('admin.roles.errors.createFailed');
    };

    const saveRole = async (name: string): Promise<RoleId> => {
        const existingRoleId = role?.id ?? createdRoleId;

        if (existingRoleId != null) {
            await editRole({ variables: { roleDto: { id: existingRoleId, name } } });
            return existingRoleId;
        }

        const { data } = await createRole({ variables: { roleDto: { name } } });
        if (!data) {
            throw new Error('addRole returned no data');
        }

        const newRoleId = data.roles.addRole.id;
        setCreatedRoleId(newRoleId);
        return newRoleId;
    };

    const onSubmit = async (data: FormInputs) => {
        setErrorMessage(null);

        let roleId: RoleId;
        try {
            roleId = await saveRole(data.name);
        } catch (error) {
            setErrorMessage(getRoleErrorMessage(error, isEditing || createdRoleId != null));
            return;
        }

        // Both mutations are idempotent, so a retry after a partial failure can replay the whole diff.
        const { upserts, deletes } = diffRoleAcls(initialAcls, data.acls);
        try {
            for (const secObjId of deletes) {
                await deleteRoleAcl({ variables: { roleId, secObjId } });
            }
            for (const acl of upserts) {
                await setRoleAcl({ variables: { roleId, secObjId: acl.secObjId, permissions: acl.permissions } });
            }
        } catch (error) {
            refetch();
            setErrorMessage(getGraphQLErrorCode(error) === FORBIDDEN_ACTION
                ? t('admin.roles.errors.editForbidden')
                : t('admin.roles.errors.permissionsFailed'));
            return;
        }

        refetch();
        onDone();
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="role-name">
                    {t('admin.roles.form.name')}
                </label>
                <input
                    id="role-name"
                    className={styles.input}
                    {...register('name', { required: t('admin.roles.form.nameRequired') })}
                />
                {errors.name && (
                    <span className={styles.errorText}>{errors.name.message}</span>
                )}
            </div>

            <div className={styles.field}>
                <span className={styles.label}>{t('admin.roles.form.permissions')}</span>
                <Controller
                    control={control}
                    name="acls"
                    render={({ field }) => (
                        <RolePermissionsEditor
                            value={field.value}
                            onChange={field.onChange}
                            secureObjects={secureObjects}
                            permissionGroups={permissionGroups}
                        />
                    )}
                />
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
                        : isEditing
                            ? t('common.saveChanges')
                            : t('admin.roles.create')}
                </button>
            </div>
        </form>
    );
}
