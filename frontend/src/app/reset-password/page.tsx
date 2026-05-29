'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { useSearchParams } from 'next/navigation';
import { resetPassword, validateResetToken } from '@/app/actions/auth-reset';
import styles from './page.module.css';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';

function Req({ met, text }: { met: boolean; text: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: met ? '#22c55e' : '#94a3b8', transition: 'color 0.2s' }}>
            {met ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {text}
        </div>
    );
}

function CountdownTimer({ seconds, onExpire, label }: { seconds: number; onExpire: () => void; label: string }) {
    const [remaining, setRemaining] = useState(seconds);

    useEffect(() => {
        if (remaining <= 0) { onExpire(); return; }
        const interval = setInterval(() => {
            setRemaining(prev => {
                if (prev <= 1) { onExpire(); clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const mins = Math.floor(remaining / 60);
    const secs = remaining % 60;
    const percent = (remaining / seconds) * 100;
    const isUrgent = remaining < 120;

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            padding: '1rem',
            background: isUrgent ? 'rgba(239,68,68,0.08)' : 'rgba(200,169,110,0.08)',
            border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(200,169,110,0.3)'}`,
            borderRadius: '0.75rem', marginBottom: '1.25rem',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <Clock size={15} color={isUrgent ? '#ef4444' : '#C8A96E'} />
                <span>{label}</span>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', fontFamily: 'monospace', color: isUrgent ? '#ef4444' : '#C8A96E', letterSpacing: '0.1em' }}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${percent}%`, background: isUrgent ? '#ef4444' : '#C8A96E', borderRadius: '2px', transition: 'width 1s linear' }} />
            </div>
        </div>
    );
}

function ResetPasswordForm() {
    const { t, language } = useTranslation();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const isRtl = language === 'ar';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const [pending, setPending] = useState(false);
    const [expired, setExpired] = useState(false);
    const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [validating, setValidating] = useState(true);

    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[@$!%*?&_#^]/.test(password),
    };
    const allValid = Object.values(checks).every(Boolean);

    useEffect(() => {
        if (!token) { setValidating(false); return; }
        validateResetToken(token).then(result => {
            if (result.error) setTokenError(result.error);
            else setAttemptsLeft(result.attemptsLeft ?? null);
            setValidating(false);
        });
    }, [token]);

    if (!token || (!validating && tokenError)) {
        return (
            <div className={styles.errorCard}>
                <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>{t('reset_password.invalid_title')}</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                    {tokenError ?? t('reset_password.invalid_default')}
                </p>
                <Link href="/forgot-password">
                    <Button fullWidth>{t('reset_password.request_new')}</Button>
                </Link>
            </div>
        );
    }

    if (expired) {
        return (
            <div className={styles.errorCard}>
                <Clock size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>{t('reset_password.expired_title')}</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{t('reset_password.expired_msg')}</p>
                <Link href="/forgot-password">
                    <Button fullWidth>{t('reset_password.request_new')}</Button>
                </Link>
            </div>
        );
    }

    if (validating) {
        return <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>{t('reset_password.validating')}</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!allValid) { setMessage(t('reset_password.pw_reqs')); return; }
        if (password !== confirmPassword) { setMessage(t('reset_password.pw_no_match')); return; }

        setPending(true);
        const formData = new FormData();
        formData.append('token', token!);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);

        const result = await resetPassword(formData);
        if (result?.error) setMessage(result.error);
        setPending(false);
    };

    return (
        <div className={styles.card} dir={isRtl ? 'rtl' : 'ltr'}>
            <h1 className={styles.title}>{t('reset_password.title')}</h1>

            <CountdownTimer seconds={600} onExpire={() => setExpired(true)} label={t('reset_password.time_label')} />

            {attemptsLeft !== null && (
                <div style={{ textAlign: 'center', fontSize: '0.8rem', color: attemptsLeft === 0 ? '#ef4444' : '#C8A96E', background: 'rgba(200,169,110,0.08)', border: '1px solid rgba(200,169,110,0.2)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', marginBottom: '1rem' }}>
                    {t('reset_password.attempts')} <strong>{attemptsLeft}</strong>
                </div>
            )}

            {message && (
                <div style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '0.75rem', borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)' }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>{t('reset_password.new_password')}</label>
                    <div style={{ position: 'relative' }}>
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={styles.input} required dir="ltr" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {password.length > 0 && (
                        <div style={{ marginTop: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <Req met={checks.length} text={t('reset_password.pw_length')} />
                            <Req met={checks.upper} text={t('reset_password.pw_upper')} />
                            <Req met={checks.lower} text={t('reset_password.pw_lower')} />
                            <Req met={checks.number} text={t('reset_password.pw_number')} />
                            <Req met={checks.special} text={t('reset_password.pw_special')} />
                        </div>
                    )}
                </div>

                <div className={styles.inputGroup}>
                    <label>{t('reset_password.confirm_password')}</label>
                    <div style={{ position: 'relative' }}>
                        <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className={styles.input} required dir="ltr" />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {confirmPassword.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.78rem', color: password === confirmPassword ? '#22c55e' : '#ef4444' }}>
                            {password === confirmPassword ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {password === confirmPassword ? t('reset_password.pw_match') : t('reset_password.pw_no_match')}
                        </div>
                    )}
                </div>

                <Button fullWidth type="submit" disabled={pending || !allValid}>
                    {pending ? t('reset_password.saving') : t('reset_password.submit')}
                </Button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link href="/login" style={{ color: '#C8A96E', fontSize: '0.875rem', textDecoration: 'none' }}>
                    {t('reset_password.back_to_login')}
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    const { language } = useTranslation();
    return (
        <div className={styles.container} dir={language === 'ar' ? 'rtl' : 'ltr'}>
            <Suspense fallback={<div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
