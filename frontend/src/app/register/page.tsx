'use client';

import { register } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../login/page.module.css';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.78rem',
            color: met ? '#22c55e' : '#94a3b8',
            transition: 'color 0.2s',
        }}>
            {met
                ? <CheckCircle size={14} style={{ color: '#22c55e' }} />
                : <XCircle size={14} style={{ color: '#94a3b8' }} />
            }
            {text}
        </div>
    );
}

export default function RegisterPage() {
    const { t, language } = useTranslation();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const isRtl = language === 'ar';

    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&_#^]/.test(password),
    };
    const allValid = Object.values(checks).every(Boolean);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);
        const result = await register(formData);
        if (result && (result as any).error) {
            setError((result as any).error);
        }
        setLoading(false);
    }

    return (
        <div className={styles.container}>
            <div className={styles.card} dir={isRtl ? 'rtl' : 'ltr'}>
                <h1 className={styles.title}>{t('register.title')}</h1>
                <p className={styles.subtitle}>{t('register.subtitle')}</p>

                {error && (
                    <div style={{
                        color: '#ef4444',
                        background: 'rgba(239,68,68,0.08)',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1rem',
                        fontSize: '0.875rem',
                        textAlign: 'center',
                        border: '1px solid rgba(239,68,68,0.3)',
                    }}>
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="name">{t('register.full_name')}</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder={t('register.name_ph')}
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">{t('register.email')}</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="name@example.com"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">{t('register.password')}</label>
                        <div className={styles.passwordWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.eyeBtn}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {password.length > 0 && (
                            <div style={{
                                marginTop: '0.6rem',
                                padding: '0.75rem',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '0.5rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.35rem',
                            }}>
                                <PasswordRequirement met={checks.length} text={t('register.pw_length')} />
                                <PasswordRequirement met={checks.upper} text={t('register.pw_upper')} />
                                <PasswordRequirement met={checks.lower} text={t('register.pw_lower')} />
                                <PasswordRequirement met={checks.number} text={t('register.pw_number')} />
                                <PasswordRequirement met={checks.special} text={t('register.pw_special')} />
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        disabled={loading || (password.length > 0 && !allValid)}
                        style={{ opacity: (password.length > 0 && !allValid) ? 0.5 : 1 }}
                    >
                        {loading ? t('register.creating') : t('register.submit')}
                    </Button>
                </form>

                <div className={styles.divider}>
                    <span>{t('register.have_account')}</span>
                </div>

                <Link href="/login" style={{ width: '100%', display: 'block' }}>
                    <Button variant="outline" size="lg" style={{ width: '100%' }}>
                        {t('register.sign_in')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
