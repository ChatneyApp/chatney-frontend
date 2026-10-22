import { Suspense, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useSuspenseQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';

import { GET_SYSTEM_CONFIG, UPDATE_SYSTEM_CONFIG_VALUE } from '@/graphql/systemConfig';
import { RolesListProvider, useRolesList } from '@/contexts/RolesListContext';
import { fromFormValue, toFormValue } from '@/helpers/configValues';
import { FORBIDDEN_ACTION, getGraphQLErrorCode, NOT_FOUND } from '@/helpers/graphqlErrors';
import { SystemConfigType, SystemConfigValue } from '@/types/systemConfig';

import { ConfigFieldDefinition, configSections } from './configFields';
import { ConfigFieldEditor, ConfigFormValues, getConfigFieldKey } from './components/ConfigFieldEditor';
import styles from './ConfigPage.module.css';

type ConfigField = {
    definition: ConfigFieldDefinition;
    config: SystemConfigValue;
};

const getType = (config: SystemConfigValue) => config.type ?? SystemConfigType.String;

function ConfigPageContent() {
    const { t } = useTranslation();
    const { data } = useSuspenseQuery(GET_SYSTEM_CONFIG, {
        fetchPolicy: 'no-cache',
    });
    const { roles } = useRolesList();
    const [updateConfig] = useMutation(UPDATE_SYSTEM_CONFIG_VALUE);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    // Rows the install wizard didn't create (SMTP settings when SMTP was skipped) can't be saved, so they're left out.
    const sections = useMemo(() => {
        const configsByName = new Map(data.configs.list.map((config) => [config.name, config]));

        return configSections.map((section) => {
            const fields: ConfigField[] = section.fields.flatMap((definition) => {
                const config = configsByName.get(definition.name);
                return config ? [{ definition, config }] : [];
            });

            return { id: section.id, fields, hasMissingFields: fields.length < section.fields.length };
        });
    }, [data]);

    const fields = useMemo(() => sections.flatMap((section) => section.fields), [sections]);

    const {
        register,
        handleSubmit,
        resetField,
        formState: { errors, isDirty, dirtyFields, isSubmitting },
    } = useForm<ConfigFormValues>({
        defaultValues: Object.fromEntries(fields.map(({ config }) => [
            getConfigFieldKey(config),
            toFormValue(getType(config), config.value),
        ])),
    });

    const saveField = async ({ definition, config }: ConfigField, formValue: ConfigFormValues[string]) => {
        const type = getType(config);
        let value = fromFormValue(type, formValue);
        if (definition.editor === 'domainUrl') {
            value = value.trim().replace(/\/+$/, '');
        }

        try {
            const result = await updateConfig({
                variables: { config: { id: config.id, name: config.name, type: config.type, value } },
            });

            if (!result.data?.configs.updateConfig) {
                return NOT_FOUND;
            }
        } catch (error) {
            return getGraphQLErrorCode(error) ?? 'UNKNOWN';
        }

        // Makes the saved value the new baseline; fields that failed stay dirty, so Save can retry them.
        resetField(getConfigFieldKey(config), { defaultValue: toFormValue(type, value) });
        return null;
    };

    const onSubmit = async (values: ConfigFormValues) => {
        setErrorMessage(null);
        setSaved(false);

        const changedFields = fields.filter(({ config }) => dirtyFields[getConfigFieldKey(config)]);
        const errorCodes = (await Promise.all(
            changedFields.map((field) => saveField(field, values[getConfigFieldKey(field.config)])),
        )).filter((code) => code !== null);

        if (errorCodes.length === 0) {
            setSaved(true);
        } else if (errorCodes.includes(FORBIDDEN_ACTION)) {
            setErrorMessage(t('admin.config.errors.forbidden'));
        } else if (errorCodes.includes(NOT_FOUND)) {
            setErrorMessage(t('admin.config.errors.notFound'));
        } else {
            setErrorMessage(t('admin.config.errors.failed'));
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>{t('admin.config.title')}</h1>
                <p className={styles.subtitle}>{t('admin.config.subtitle')}</p>
            </header>

            <form className={styles.form} noValidate onSubmit={handleSubmit(onSubmit)}>
                {sections.map((section) => (
                    <section key={section.id} className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t(`admin.config.sections.${section.id}`)}</h2>
                        {section.hasMissingFields && (
                            <p className={styles.note}>{t(`admin.config.missingFields.${section.id}`)}</p>
                        )}
                        {section.fields.map(({ definition, config }) => (
                            <ConfigFieldEditor
                                key={config.id}
                                definition={definition}
                                config={config}
                                roles={roles}
                                register={register}
                                error={errors[getConfigFieldKey(config)]}
                            />
                        ))}
                    </section>
                ))}

                {errorMessage && (
                    <div role="alert" className={styles.errorMessage}>{errorMessage}</div>
                )}

                <div className={styles.actions}>
                    {saved && !isDirty && (
                        <span role="status" className={styles.savedText}>{t('admin.config.saved')}</span>
                    )}
                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={!isDirty || isSubmitting}
                    >
                        {isSubmitting ? t('common.saving') : t('admin.config.save')}
                    </button>
                </div>
            </form>
        </div>
    );
}

export function ConfigPage() {
    const { t } = useTranslation();

    return (
        <Suspense fallback={<div className={styles.loading}>{t('admin.config.loading')}</div>}>
            <RolesListProvider>
                <ConfigPageContent />
            </RolesListProvider>
        </Suspense>
    );
}
