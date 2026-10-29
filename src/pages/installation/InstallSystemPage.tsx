import { installSystem } from '@/graphql/systemConfig';
import { getTimeZoneOptions } from '@/helpers/timeZones';
import { clientStartPageUrl } from '@/infra/consts';
import { useApolloClient } from '@apollo/client/react';
import {
    ArrowRight,
    Check,
    CircleCheckBig,
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
import { useTranslation } from 'react-i18next';
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

const steps = [
    { id: 'workspace', icon: Globe2 },
    { id: 'email', icon: Mail },
    { id: 'review', icon: ShieldCheck },
] as const;

export const InstallSystemPage = () => {
    const { t } = useTranslation();
    const apollo = useApolloClient();
    const [step, setStep] = useState(0);
    const [furthestStep, setFurthestStep] = useState(0);
    const [installed, setInstalled] = useState(false);
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
            setInstalled(true);
        } catch (error) {
            setErrorMessage(t('install.error', { message: (error as Error).message }));
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
            const nextStep = step + 1;
            setStep(nextStep);
            setFurthestStep(current => Math.max(current, nextStep));
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
                        <span className={styles.eyebrow}>{t('install.eyebrow')}</span>
                        <h1>{t('install.heading')}</h1>
                        <p>{t('install.intro')}</p>
                    </div>
                    <ol className={styles.steps}>
                        {steps.map((item, index) => {
                            const Icon = item.icon;
                            const isDone = installed || index < step;
                            return (
                                <li
                                    className={`${styles.step} ${!installed && index === step ? styles.stepActive : ''} ${isDone ? styles.stepDone : ''}`}
                                    key={item.id}
                                >
                                    <button
                                        type="button"
                                        className={styles.stepButton}
                                        disabled={loading || installed || index > furthestStep}
                                        onClick={() => setStep(index)}
                                    >
                                        <span className={styles.stepIcon}>
                                            {isDone ? <Check size={17} /> : <Icon size={17} />}
                                        </span>
                                        <span>
                                            <strong>{t(`install.steps.${item.id}.title`)}</strong>
                                            <small>{t(`install.steps.${item.id}.description`)}</small>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                    <p className={styles.secureNote}><ShieldCheck size={15} /> {t('install.secureNote')}</p>
                </aside>

                <form className={styles.form} onSubmit={event => event.preventDefault()}>
                    <div className={styles.formHeader}>
                        <span>{installed ? t('install.completed') : t('install.stepCounter', { current: step + 1, total: steps.length })}</span>
                        <div className={styles.progress}><i style={{ width: installed ? '100%' : `${((step + 1) / steps.length) * 100}%` }} /></div>
                    </div>

                    {!installed && step === 0 && (
                        <section className={styles.panel}>
                            <div className={styles.panelTitle}>
                                <span className={styles.panelIcon}><Globe2 size={22} /></span>
                                <div>
                                    <h2>{t('install.workspace.title')}</h2>
                                    <p>{t('install.workspace.description')}</p>
                                </div>
                            </div>
                            <label className={styles.field}>
                                <span>{t('install.workspace.domainName')}</span>
                                <input
                                    type="url"
                                    placeholder="https://chat.example.com"
                                    {...register('domainName', { required: t('install.workspace.domainNameRequired') })}
                                />
                                <small>{t('install.workspace.domainNameHint')}</small>
                                {errors.domainName && <em>{errors.domainName.message}</em>}
                            </label>
                            <label className={styles.field}>
                                <span>{t('install.workspace.timeZone')}</span>
                                <select {...register('timeZone', { required: t('install.workspace.timeZoneRequired') })}>
                                    {getTimeZoneOptions(browserTimeZone).map(timeZone => <option value={timeZone} key={timeZone}>{timeZone}</option>)}
                                </select>
                                <small>{t('install.workspace.timeZoneHint')}</small>
                            </label>
                            <label className={styles.checkCard}>
                                <input type="checkbox" {...register('seedTestData')} />
                                <span className={styles.checkBox}><Check size={13} /></span>
                                <Database size={20} />
                                <span>
                                    <strong>{t('install.workspace.seedTestData')}</strong>
                                    <small>{t('install.workspace.seedTestDataHint')}</small>
                                </span>
                            </label>
                        </section>
                    )}

                    {!installed && step === 1 && (
                        <section className={styles.panel}>
                            <div className={styles.panelTitle}>
                                <span className={styles.panelIcon}><Mail size={22} /></span>
                                <div>
                                    <h2>{t('install.email.title')}</h2>
                                    <p>{t('install.email.description')}</p>
                                </div>
                            </div>
                            <label className={styles.toggleRow}>
                                <span>
                                    <strong>{t('install.email.smtpEnabled')}</strong>
                                    <small>{t('install.email.smtpEnabledHint')}</small>
                                </span>
                                <input type="checkbox" {...register('smtpEnabled')} />
                                <i />
                            </label>
                            {values.smtpEnabled && (
                                <div className={styles.smtpFields}>
                                    <div className={styles.fieldGrid}>
                                        <label className={styles.field}>
                                            <span>{t('install.email.host')}</span>
                                            <input
                                                placeholder="smtp.example.com"
                                                {...register('smtp.host', { required: t('install.email.hostRequired') })}
                                            />
                                            {errors.smtp?.host && <em>{errors.smtp.host.message}</em>}
                                        </label>
                                        <label className={styles.field}>
                                            <span>{t('install.email.port')}</span>
                                            <input
                                                type="number"
                                                {...register('smtp.port', {
                                                    required: t('install.email.portRequired'),
                                                    valueAsNumber: true,
                                                    min: { value: 1, message: t('install.email.portInvalid') },
                                                    max: { value: 65535, message: t('install.email.portInvalid') },
                                                })}
                                            />
                                            {errors.smtp?.port && <em>{errors.smtp.port.message}</em>}
                                        </label>
                                    </div>
                                    <div className={styles.fieldGrid}>
                                        <label className={styles.field}>
                                            <span>{t('install.email.username')} <b>{t('common.optional')}</b></span>
                                            <input autoComplete="username" {...register('smtp.username')} />
                                        </label>
                                        <label className={styles.field}>
                                            <span>{t('install.email.password')} <b>{t('common.optional')}</b></span>
                                            <input type="password" autoComplete="new-password" {...register('smtp.password')} />
                                        </label>
                                    </div>
                                    <label className={styles.field}>
                                        <span>{t('install.email.fromAddress')}</span>
                                        <input
                                            type="email"
                                            placeholder="noreply@example.com"
                                            {...register('smtp.fromAddress', { required: t('install.email.fromAddressRequired') })}
                                        />
                                        {errors.smtp?.fromAddress && <em>{errors.smtp.fromAddress.message}</em>}
                                    </label>
                                    <label className={styles.inlineCheck}>
                                        <input type="checkbox" {...register('smtp.enableSsl')} />
                                        <span className={styles.checkBox}><Check size={13} /></span>
                                        {t('install.email.enableSsl')}
                                    </label>
                                </div>
                            )}
                            {!values.smtpEnabled && (
                                <div className={styles.skipMessage}>
                                    <Mail size={20} />
                                    <span><strong>{t('install.email.skippedTitle')}</strong>{t('install.email.skippedDescription')}</span>
                                </div>
                            )}
                        </section>
                    )}

                    {!installed && step === 2 && (
                        <section className={styles.panel}>
                            <div className={styles.panelTitle}>
                                <span className={styles.panelIcon}><ShieldCheck size={22} /></span>
                                <div>
                                    <h2>{t('install.review.title')}</h2>
                                    <p>{t('install.review.description')}</p>
                                </div>
                            </div>
                            <dl className={styles.review}>
                                <div><dt>{t('install.review.domain')}</dt><dd>{values.domainName}</dd></div>
                                <div><dt>{t('install.review.timeZone')}</dt><dd>{values.timeZone}</dd></div>
                                <div><dt>{t('install.review.email')}</dt><dd>{values.smtpEnabled ? `${values.smtp.host}:${values.smtp.port}` : t('install.review.notConfigured')}</dd></div>
                                <div><dt>{t('install.review.testData')}</dt><dd>{values.seedTestData ? t('install.review.included') : t('install.review.notIncluded')}</dd></div>
                            </dl>
                            <div className={styles.installNote}>
                                <Database size={20} />
                                <span><strong>{t('install.review.databaseTitle')}</strong>{t('install.review.databaseDescription')}</span>
                            </div>
                            {errorMessage && <div className={styles.errorText} role="alert">{errorMessage}</div>}
                        </section>
                    )}

                    {installed && (
                        <section className={styles.successPanel}>
                            <span className={styles.successIcon}><CircleCheckBig size={38} /></span>
                            <div>
                                <span className={styles.eyebrow}>{t('install.success.eyebrow')}</span>
                                <h2>{t('install.success.title')}</h2>
                                <p>{t('install.success.description')}</p>
                            </div>
                            <a className={styles.primaryButton} href={clientStartPageUrl}>
                                {t('install.success.goToApp')} <ArrowRight size={18} />
                            </a>
                        </section>
                    )}

                    {!installed && (
                        <div className={`${styles.actions} ${step === steps.length - 1 ? styles.installActions : ''}`}>
                            {step > 0 ? (
                                <button type="button" className={styles.backButton} onClick={() => setStep(current => current - 1)} disabled={loading}>
                                    <ChevronLeft size={18} /> {t('install.back')}
                                </button>
                            ) : <span />}
                            {step < steps.length - 1 ? (
                                <button type="button" className={styles.primaryButton} onClick={goNext}>
                                    {t('install.continue')} <ChevronRight size={18} />
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    className={styles.installButton}
                                    disabled={loading}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    {loading ? <><LoaderCircle className={styles.spinner} size={22} /> {t('install.installing')}</> : t('install.submit')}
                                </button>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </main>
    );
}
