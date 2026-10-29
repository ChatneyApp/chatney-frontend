import { FieldError, UseFormRegister } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { ConfigFormValue, isIntegerString, isValidDomainUrl } from '@/helpers/configValues';
import { getTimeZoneOptions } from '@/helpers/timeZones';
import { Role } from '@/types/roles';
import { SystemConfigType, SystemConfigValue } from '@/types/systemConfig';

import { ConfigFieldDefinition } from '../configFields';
import styles from './ConfigFieldEditor.module.css';

export type ConfigFormValues = Record<string, ConfigFormValue>;

export const getConfigFieldKey = (config: SystemConfigValue) => `c${config.id}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;

type Props = {
    definition: ConfigFieldDefinition;
    config: SystemConfigValue;
    roles: Role[];
    register: UseFormRegister<ConfigFormValues>;
    error?: FieldError;
};

export function ConfigFieldEditor({ definition, config, roles, register, error }: Props) {
    const { t } = useTranslation();
    const key = getConfigFieldKey(config);
    const id = `config-${config.id}`;
    const hintId = `${id}-hint`;
    const label = t(`admin.config.fields.${definition.labelKey}`);
    const type = config.type ?? SystemConfigType.String;
    const hint = definition.hasHint
        ? t(`admin.config.hints.${definition.labelKey}`)
        : (type === SystemConfigType.StringArray ? t('admin.config.listHint') : null);
    const describedBy = hint ? hintId : undefined;

    const renderEditor = () => {
        switch (definition.editor) {
            case 'role':
                return (
                    <select id={id} className={styles.input} aria-describedby={describedBy} {...register(key)}>
                        {!roles.some((role) => String(role.id) === config.value) && (
                            <option value={config.value}>{t('admin.config.unknownRole', { id: config.value })}</option>
                        )}
                        {roles.map((role) => <option key={role.id} value={String(role.id)}>{role.name}</option>)}
                    </select>
                );
            case 'timeZone':
                return (
                    <select id={id} className={styles.input} aria-describedby={describedBy} {...register(key)}>
                        {getTimeZoneOptions(config.value).map((timeZone) => (
                            <option key={timeZone} value={timeZone}>{timeZone}</option>
                        ))}
                    </select>
                );
            case 'domainUrl':
                return (
                    <input
                        id={id}
                        type="url"
                        className={styles.input}
                        placeholder="https://chat.example.com"
                        aria-describedby={describedBy}
                        {...register(key, {
                            validate: (value) => isValidDomainUrl(String(value)) || t('admin.config.validation.domainInvalid'),
                        })}
                    />
                );
        }

        switch (type) {
            case SystemConfigType.Int:
                return (
                    <input
                        id={id}
                        type="number"
                        className={styles.input}
                        aria-describedby={describedBy}
                        {...register(key, {
                            validate: (value) => {
                                const text = String(value);
                                const number = Number(text);
                                const inRange = (definition.min === undefined || number >= definition.min)
                                    && (definition.max === undefined || number <= definition.max);

                                if (isIntegerString(text) && inRange) {
                                    return true;
                                }

                                return definition.min !== undefined && definition.max !== undefined
                                    ? t('admin.config.validation.intOutOfRange', { min: definition.min, max: definition.max })
                                    : t('admin.config.validation.intInvalid');
                            },
                        })}
                    />
                );
            case SystemConfigType.StringArray:
                return (
                    <textarea id={id} rows={4} className={styles.input} aria-describedby={describedBy} {...register(key)} />
                );
            default:
                return (
                    <input
                        id={id}
                        type={definition.inputType ?? 'text'}
                        className={styles.input}
                        autoComplete={definition.autoComplete}
                        aria-describedby={describedBy}
                        {...register(key, definition.inputType === 'email'
                            ? {
                                validate: (value) => String(value).trim() === ''
                                    || EMAIL_PATTERN.test(String(value).trim())
                                    || t('admin.config.validation.emailInvalid'),
                            }
                            : undefined)}
                    />
                );
        }
    };

    if (type === SystemConfigType.Bool && !definition.editor) {
        return (
            <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                    <input type="checkbox" className={styles.checkbox} aria-describedby={describedBy} {...register(key)} />
                    {label}
                </label>
                {hint && <span id={hintId} className={styles.hint}>{hint}</span>}
            </div>
        );
    }

    return (
        <div className={styles.field}>
            <label className={styles.label} htmlFor={id}>{label}</label>
            {renderEditor()}
            {hint && <span id={hintId} className={styles.hint}>{hint}</span>}
            {error && <span className={styles.errorText}>{error.message}</span>}
        </div>
    );
}
