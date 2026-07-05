import { useState } from 'react';
import { Github, Monitor } from 'lucide-react';

import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import styles from './AuthForm.module.css';

type AuthMode = 'login' | 'register';

export const AuthForm = () => {
    const [mode, setMode] = useState<AuthMode>('login');
    const isLogin = mode === 'login';

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h1 className={styles.title}>
                    {isLogin ? 'Sign in to Chatney' : 'Create your account'}
                </h1>
                <p className={styles.subtitle}>
                    {isLogin
                        ? 'Connect with your team and workspaces.'
                        : 'Join your team and start collaborating.'}
                </p>

                {isLogin && (
                    <>
                        <div className={styles.socialRow} aria-label="Social sign-in options">
                            <button type="button" className={styles.socialButton} disabled title="Coming soon">
                                <Github size={20} strokeWidth={1.75} />
                            </button>
                            <button type="button" className={styles.socialButton} disabled title="Coming soon">
                                <Monitor size={20} strokeWidth={1.75} />
                            </button>
                            <button type="button" className={styles.socialButton} disabled title="Coming soon">
                                <span className="text-sm font-semibold tracking-tight">iOS</span>
                            </button>
                        </div>

                        <div className={styles.divider}>
                            <span className={styles.dividerText}>Or email</span>
                        </div>
                    </>
                )}

                {isLogin ? <LoginForm /> : <RegisterForm />}

                <p className={styles.switchMode}>
                    {isLogin ? (
                        <>
                            New here?{' '}
                            <button
                                type="button"
                                className={styles.switchLink}
                                onClick={() => setMode('register')}
                            >
                                Create an account
                            </button>
                        </>
                    ) : (
                        <>
                            Already have an account?{' '}
                            <button
                                type="button"
                                className={styles.switchLink}
                                onClick={() => setMode('login')}
                            >
                                Sign in
                            </button>
                        </>
                    )}
                </p>
            </div>

            <footer className={styles.pageFooter}>
                <a href="/privacy" className={styles.footerLink}>Privacy Policy</a>
                <a href="/terms" className={styles.footerLink}>Terms of Service</a>
                <a href="/support" className={styles.footerLink}>Contact Support</a>
            </footer>
        </div>
    );
};
