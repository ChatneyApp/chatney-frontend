import { useState } from 'react';
import { Github, Monitor } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import styles from './AuthForm.module.css';

type AuthMode = 'login' | 'register';

export const AuthForm = () => {
    const { t } = useTranslation();
    const [mode, setMode] = useState<AuthMode>('login');
    const isLogin = mode === 'login';

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {isLogin ? t('auth.signInTitle') : t('auth.registerTitle')}
                </h1>
                <p className={styles.subtitle}>
                    {isLogin
                        ? t('auth.signInSubtitle')
                        : t('auth.registerSubtitle')}
                </p>

                {isLogin && (
                    <>
                        <div className={styles.socialRow} aria-label={t('auth.socialOptions')}>
                            <button type="button" className={styles.socialButton} disabled title={t('common.comingSoon')}>
                                <Github size={20} strokeWidth={1.75} />
                            </button>
                            <button type="button" className={styles.socialButton} disabled title={t('common.comingSoon')}>
                                <Monitor size={20} strokeWidth={1.75} />
                            </button>
                            <button type="button" className={styles.socialButton} disabled title={t('common.comingSoon')}>
                                <span className="text-sm font-semibold tracking-tight">iOS</span>
                            </button>
                        </div>

                        <div className={styles.divider}>
                            <span className={styles.dividerText}>{t('auth.orEmail')}</span>
                        </div>
                    </>
                )}

                {isLogin ? <LoginForm /> : <RegisterForm />}

                <p className={styles.switchMode}>
                    {isLogin ? (
                        <>
                            {t('auth.newHere')}{' '}
                            <button
                                type="button"
                                className={styles.switchLink}
                                onClick={() => setMode('register')}
                            >
                                {t('auth.createAccountLink')}
                            </button>
                        </>
                    ) : (
                        <>
                            {t('auth.haveAccount')}{' '}
                            <button
                                type="button"
                                className={styles.switchLink}
                                onClick={() => setMode('login')}
                            >
                                {t('auth.signInLink')}
                            </button>
                        </>
                    )}
                </p>
            </div>

            <footer className={styles.pageFooter}>
                <a href="/privacy" className={styles.footerLink}>{t('auth.footer.privacy')}</a>
                <a href="/terms" className={styles.footerLink}>{t('auth.footer.terms')}</a>
                <a href="/support" className={styles.footerLink}>{t('auth.footer.support')}</a>
            </footer>
        </div>
    );
};
