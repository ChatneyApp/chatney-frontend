import { installSystem } from '@/graphql/systemConfig';
import { clientStartPageUrl } from '@/infra/consts';
import { useApolloClient } from '@apollo/client/react';
import {
    Check,
    ChevronLeft,
    ChevronRight,
    Database,
    Globe2,
    LoaderCircle,
    Mail,
    MessageCircle,
    ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './Form.module.css';

type InstallFormValues = {
    domainName: string;
    timeZone: string;
    seedTestData: boolean;
    smtpEnabled: boolean;
    smtp: {
        host: string;
        port: number;
        username: string;
        password: string;
        enableSsl: boolean;
        fromAddress: string;
    };
};

const timeZones = [
    'UTC',
    'America/Los_Angeles',
    'America/Denver',
    'America/Chicago',
    'America/New_York',
    'America/Sao_Paulo',
    'Europe/London',
    'Europe/Berlin',
    'Europe/Kyiv',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Tokyo',
    'Australia/Sydney',
];

const steps = [
    { title: 'Workspace', description: 'Domain and regional settings', icon: Globe2 },
    { title: 'Email', description: 'Optional SMTP delivery', icon: Mail },
    { title: 'Review', description: 'Confirm and install', icon: ShieldCheck },
];

export const InstallSystemPage = () => {
    const apollo = useApolloClient();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const browserTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
    } = useForm<InstallFormValues>({
        defaultValues: {
            domainName: window.location.origin,
            timeZone: browserTimeZone,
            seedTestData: false,
            smtpEnabled: false,
            smtp: {
                port: 587,
                enableSsl: true,
            },
        },
    });
    const values = watch();

    const onSubmit = async (form: InstallFormValues) => {
        setLoading(true);
        setErrorMessage(null);

        try {
            await installSystem(apollo, {
                domainName: form.domainName,
                timeZone: form.timeZone,
                seedTestData: form.seedTestData,
                smtp: form.smtpEnabled ? form.smtp : null,
            });
            window.location.href = clientStartPageUrl;
        } catch (error) {
            setErrorMessage(`System install error: ${(error as Error).message}`);
        } finally {
            setLoading(false);
        }
    };

    const goNext = async () => {
        const fields = step === 0
            ? (['domainName', 'timeZone'] as const)
            : (values.smtpEnabled
                ? (['smtp.host', 'smtp.port', 'smtp.fromAddress'] as const)
                : (['smtpEnabled'] as const));

        if (await trigger(fields)) {
            setStep(current => current + 1);
        }
    };

    return (
        <main className={styles.page}>
            <div className={styles.shell}>
                <aside className={styles.sidebar}>
                    <div className={styles.brand}>
                        <span className={styles.logo}><MessageCircle size={22} /></span>
                        <span>Chatney</span>
                    </div>
                    <div className={styles.intro}>
                        <span className={styles.eyebrow}>First-time setup</span>
                        <h1>Make Chatney yours.</h1>
                        <p>A few details and your private team space will be ready.</p>
                    </div>
                    <ol className={styles.steps}>
                        {steps.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <li
                                    className={`${styles.step} ${index === step ? styles.stepActive : ''} ${index < step ? styles.stepDone : ''}`}
                                    key={item.title}
                                >
                                    <span className={styles.stepIcon}>
                                        {index < step ? <Check size={17} /> : <Icon size={17} />}
                                    </span>
                                    <span>
                                        <strong>{item.title}</strong>
                                        <small>{item.description}</small>
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                    <p className={styles.secureNote}><ShieldCheck size={15} /> Settings stay on your server</p>
                </aside>

                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles.formHeader}>
                        <span>Step {step + 1} of {steps.length}</span>
                        <div className={styles.progress}><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div>
                    </div>

                    {step === 0 && (
                        <section className={styles.panel}>
                            <div className={styles.panelTitle}>
                                <span className={styles.panelIcon}><Globe2 size={22} /></span>
                                <div>
                                    <h2>Workspace settings</h2>
                                    <p>Set the public address and local time for this installation.</p>
                                </div>
                            </div>
                            <label className={styles.field}>
                                <span>Domain name</span>
                                <input
                                    type="url"
                                    placeholder="https://chat.example.com"
                                    {...register('domainName', { required: 'Domain name is required' })}
                                />
                                <small>Used for links in invitations and password reset emails.</small>
                                {errors.domainName && <em>{errors.domainName.message}</em>}
                            </label>
                            <label className={styles.field}>
                                <span>Time zone</span>
                                <select {...register('timeZone', { required: 'Time zone is required' })}>
                                    {!timeZones.includes(browserTimeZone) && (
                                        <option value={browserTimeZone}>{browserTimeZone}</option>
                                    )}
                                    {timeZones.map(timeZone => <option value={timeZone} key={timeZone}>{timeZone}</option>)}
                                </select>
                                <small>Dates and scheduled activity will use this time zone.</small>
                            </label>
                            <label className={styles.checkCard}>
                                <input type="checkbox" {...register('seedTestData')} />
                                <span className={styles.checkBox}><Check size={13} /></span>
                                <Database size={20} />
                                <span>
                                    <strong>Add testing data</strong>
                                    <small>Create two sample users so you can explore right away.</small>
                                </span>
                            </label>
                        </section>
                    )}

                    {step === 1 && (
                        <section className={styles.panel}>
                            <div className={styles.panelTitle}>
                                <span className={styles.panelIcon}><Mail size={22} /></span>
                                <div>
                                    <h2>Email delivery</h2>
                                    <p>Connect an SMTP server for password resets. You can skip this for now.</p>
                                </div>
                            </div>
                            <label className={styles.toggleRow}>
                                <span>
                                    <strong>Configure SMTP server</strong>
                                    <small>Enable outgoing system email</small>
                                </span>
                                <input type="checkbox" {...register('smtpEnabled')} />
                                <i />
                            </label>
                            {values.smtpEnabled && (
                                <div className={styles.smtpFields}>
                                    <div className={styles.fieldGrid}>
                                        <label className={styles.field}>
                                            <span>SMTP host</span>
                                            <input
                                                placeholder="smtp.example.com"
                                                {...register('smtp.host', { required: 'SMTP host is required' })}
                                            />
                                            {errors.smtp?.host && <em>{errors.smtp.host.message}</em>}
                                        </label>
                                        <label className={styles.field}>
                                            <span>Port</span>
                                            <input
                                                type="number"
                                                {...register('smtp.port', {
                                                    required: 'Port is required',
                                                    valueAsNumber: true,
                                                    min: { value: 1, message: 'Use a valid port' },
                                                    max: { value: 65535, message: 'Use a valid port' },
                                                })}
                                            />
                                            {errors.smtp?.port && <em>{errors.smtp.port.message}</em>}
                                        </label>
                                    </div>
                                    <div className={styles.fieldGrid}>
                                        <label className={styles.field}>
                                            <span>Username <b>Optional</b></span>
                                            <input autoComplete="username" {...register('smtp.username')} />
                                        </label>
                                        <label className={styles.field}>
                                            <span>Password <b>Optional</b></span>
                                            <input type="password" autoComplete="new-password" {...register('smtp.password')} />
                                        </label>
                                    </div>
                                    <label className={styles.field}>
                                        <span>From address</span>
                                        <input
                                            type="email"
                                            placeholder="noreply@example.com"
                                            {...register('smtp.fromAddress', { required: 'From address is required' })}
                                        />
                                        {errors.smtp?.fromAddress && <em>{errors.smtp.fromAddress.message}</em>}
                                    </label>
                                    <label className={styles.inlineCheck}>
                                        <input type="checkbox" {...register('smtp.enableSsl')} />
                                        <span className={styles.checkBox}><Check size={13} /></span>
                                        Use a secure TLS connection
                                    </label>
                                </div>
                            )}
                            {!values.smtpEnabled && (
                                <div className={styles.skipMessage}>
                                    <Mail size={20} />
                                    <span><strong>No email server</strong>Password reset emails will be unavailable until SMTP is configured.</span>
                                </div>
                            )}
                        </section>
                    )}

                    {step === 2 && (
                        <section className={styles.panel}>
                            <div className={styles.panelTitle}>
                                <span className={styles.panelIcon}><ShieldCheck size={22} /></span>
                                <div>
                                    <h2>Ready to install</h2>
                                    <p>Review your choices. Chatney will create the database structure and defaults.</p>
                                </div>
                            </div>
                            <dl className={styles.review}>
                                <div><dt>Domain</dt><dd>{values.domainName}</dd></div>
                                <div><dt>Time zone</dt><dd>{values.timeZone}</dd></div>
                                <div><dt>Email</dt><dd>{values.smtpEnabled ? `${values.smtp.host}:${values.smtp.port}` : 'Not configured'}</dd></div>
                                <div><dt>Testing data</dt><dd>{values.seedTestData ? 'Included' : 'Not included'}</dd></div>
                            </dl>
                            <div className={styles.installNote}>
                                <Database size={20} />
                                <span><strong>Your database will be initialized</strong>This can take a few moments. Keep this page open until setup completes.</span>
                            </div>
                            {errorMessage && <div className={styles.errorText} role="alert">{errorMessage}</div>}
                        </section>
                    )}

                    <div className={styles.actions}>
                        {step > 0 ? (
                            <button type="button" className={styles.backButton} onClick={() => setStep(current => current - 1)} disabled={loading}>
                                <ChevronLeft size={18} /> Back
                            </button>
                        ) : <span />}
                        {step < steps.length - 1 ? (
                            <button type="button" className={styles.primaryButton} onClick={goNext}>
                                Continue <ChevronRight size={18} />
                            </button>
                        ) : (
                            <button type="submit" className={styles.primaryButton} disabled={loading}>
                                {loading ? <><LoaderCircle className={styles.spinner} size={18} /> Installing...</> : 'Install Chatney'}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </main>
    );
}
