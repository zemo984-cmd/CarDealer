'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { useSearchParams } from 'next/navigation';
import { resetPassword, validateResetToken } from '@/app/actions/auth-reset';
import styles from './page.module.css';
import Link from 'next/link';
import { Eye, EyeOff, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';

// ── Password requirement indicator ──
function Req({ met, text }: { met: boolean; text: string }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: met ? '#22c55e' : '#94a3b8', transition: 'color 0.2s' }}>
            {met ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {text}
        </div>
    );
}

// ── Countdown Timer ──
function CountdownTimer({ seconds, onExpire }: { seconds: number; onExpire: () => void }) {
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
    const isUrgent = remaining < 120; // last 2 minutes

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '1rem',
            background: isUrgent ? 'rgba(239,68,68,0.08)' : 'rgba(200,169,110,0.08)',
            border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(200,169,110,0.3)'}`,
            borderRadius: '0.75rem',
            marginBottom: '1.25rem',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <Clock size={15} color={isUrgent ? '#ef4444' : '#C8A96E'} />
                <span>الوقت المتبقي لصلاحية الرابط</span>
            </div>
            {/* Timer display */}
            <div style={{
                fontSize: '2rem',
                fontWeight: '700',
                fontFamily: 'monospace',
                color: isUrgent ? '#ef4444' : '#C8A96E',
                letterSpacing: '0.1em',
            }}>
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </div>
            {/* Progress bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: isUrgent ? '#ef4444' : '#C8A96E',
                    borderRadius: '2px',
                    transition: 'width 1s linear',
                }} />
            </div>
        </div>
    );
}

// ── Main Reset Form ──
function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

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

    // Validate token on mount
    useEffect(() => {
        if (!token) { setValidating(false); return; }
        validateResetToken(token).then(result => {
            if (result.error) {
                setTokenError(result.error);
            } else {
                setAttemptsLeft(result.attemptsLeft ?? null);
            }
            setValidating(false);
        });
    }, [token]);

    if (!token || (!validating && tokenError)) {
        return (
            <div className={styles.errorCard}>
                <ShieldAlert size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>رابط غير صالح</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
                    {tokenError ?? 'رمز إعادة التعيين مفقود أو غير صالح.'}
                </p>
                <Link href="/forgot-password">
                    <Button fullWidth>طلب رابط جديد</Button>
                </Link>
            </div>
        );
    }

    if (expired) {
        return (
            <div className={styles.errorCard}>
                <Clock size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
                <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>انتهت صلاحية الرابط</h3>
                <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>مرّت 10 دقائق. يرجى طلب رابط جديد.</p>
                <Link href="/forgot-password">
                    <Button fullWidth>طلب رابط جديد</Button>
                </Link>
            </div>
        );
    }

    if (validating) {
        return <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>جاري التحقق من الرابط...</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!allValid) { setMessage('يرجى استيفاء جميع متطلبات كلمة المرور'); return; }
        if (password !== confirmPassword) { setMessage('كلمات المرور غير متطابقة'); return; }

        setPending(true);
        const formData = new FormData();
        formData.append('token', token!);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);

        const result = await resetPassword(formData);
        if (result?.error) {
            setMessage(result.error);
        }
        setPending(false);
    };

    return (
        <div className={styles.card}>
            <h1 className={styles.title}>تعيين كلمة مرور جديدة</h1>

            {/* Countdown Timer – 10 min = 600 seconds */}
            <CountdownTimer seconds={600} onExpire={() => setExpired(true)} />

            {/* Attempts left badge */}
            {attemptsLeft !== null && (
                <div style={{
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    color: attemptsLeft === 0 ? '#ef4444' : '#C8A96E',
                    background: 'rgba(200,169,110,0.08)',
                    border: '1px solid rgba(200,169,110,0.2)',
                    borderRadius: '0.5rem',
                    padding: '0.4rem 0.75rem',
                    marginBottom: '1rem',
                }}>
                    محاولات متبقية لهذا الرابط: <strong>{attemptsLeft}</strong>
                </div>
            )}

            {message && (
                <div style={{
                    color: '#ef4444', background: 'rgba(239,68,68,0.08)', padding: '0.75rem',
                    borderRadius: '0.5rem', marginBottom: '1rem', fontSize: '0.875rem',
                    textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)',
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>كلمة المرور الجديدة</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className={styles.input}
                            required dir="ltr"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

                    {/* Live requirements */}
                    {password.length > 0 && (
                        <div style={{ marginTop: '0.6rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <Req met={checks.length} text="8 أحرف على الأقل" />
                            <Req met={checks.upper} text="حرف كبير (A-Z)" />
                            <Req met={checks.lower} text="حرف صغير (a-z)" />
                            <Req met={checks.number} text="رقم (0-9)" />
                            <Req met={checks.special} text="رمز خاص (@$!%*?&)" />
                        </div>
                    )}
                </div>

                <div className={styles.inputGroup}>
                    <label>تأكيد كلمة المرور</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            type={showConfirm ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className={styles.input}
                            required dir="ltr"
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {/* Match indicator */}
                    {confirmPassword.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem', fontSize: '0.78rem', color: password === confirmPassword ? '#22c55e' : '#ef4444' }}>
                            {password === confirmPassword ? <CheckCircle size={14} /> : <XCircle size={14} />}
                            {password === confirmPassword ? 'كلمتا المرور متطابقتان' : 'كلمتا المرور غير متطابقتين'}
                        </div>
                    )}
                </div>

                <Button fullWidth type="submit" disabled={pending || !allValid}>
                    {pending ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
                </Button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Link href="/login" style={{ color: '#C8A96E', fontSize: '0.875rem', textDecoration: 'none' }}>
                    العودة إلى تسجيل الدخول
                </Link>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className={styles.container} dir="rtl">
            <Suspense fallback={<div style={{ textAlign: 'center', color: '#94a3b8', padding: '3rem' }}>جاري التحميل...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
