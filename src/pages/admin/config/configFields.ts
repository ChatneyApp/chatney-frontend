export type ConfigEditor = 'role' | 'domainUrl' | 'timeZone';

export type ConfigFieldDefinition = {
    /** Config name in the `configs` table. */
    name: string;
    /** Key under `admin.config.fields`; config names are dotted, so they can't be i18n keys. */
    labelKey: string;
    hasHint?: boolean;
    /** Replaces the editor picked from the config type. */
    editor?: ConfigEditor;
    inputType?: 'email' | 'password';
    autoComplete?: string;
    min?: number;
    max?: number;
};

export type ConfigSectionDefinition = {
    id: 'general' | 'email';
    fields: ConfigFieldDefinition[];
};

export const configSections: ConfigSectionDefinition[] = [
    {
        id: 'general',
        fields: [
            { name: 'settings.newUserDefaultRole', labelKey: 'newUserDefaultRole', hasHint: true, editor: 'role' },
            { name: 'system.domainName', labelKey: 'domainName', hasHint: true, editor: 'domainUrl' },
            { name: 'system.timeZone', labelKey: 'timeZone', hasHint: true, editor: 'timeZone' },
        ],
    },
    {
        id: 'email',
        fields: [
            { name: 'smtp.enabled', labelKey: 'smtpEnabled', hasHint: true },
            { name: 'smtp.host', labelKey: 'smtpHost' },
            { name: 'smtp.port', labelKey: 'smtpPort', min: 1, max: 65535 },
            { name: 'smtp.username', labelKey: 'smtpUsername', autoComplete: 'off' },
            { name: 'smtp.password', labelKey: 'smtpPassword', inputType: 'password', autoComplete: 'new-password' },
            { name: 'smtp.enableSsl', labelKey: 'smtpEnableSsl' },
            { name: 'smtp.fromAddress', labelKey: 'smtpFromAddress', inputType: 'email' },
        ],
    },
];
