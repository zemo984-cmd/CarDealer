'use client';

import { register } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';
import { useState } from 'react';
import styles from '../login/page.module.css';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

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
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

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
            <div className={styles.card}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join our dealership management system</p>

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
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="John Doe"
                            className={styles.input}
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
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
                        <label htmlFor="password">Password</label>
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

                        {/* Password strength requirements */}
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
                                <PasswordRequirement met={checks.length} text="At least 8 characters" />
                                <PasswordRequirement met={checks.upper} text="One uppercase letter (A-Z)" />
                                <PasswordRequirement met={checks.lower} text="One lowercase letter (a-z)" />
                                <PasswordRequirement met={checks.number} text="One number (0-9)" />
                                <PasswordRequirement met={checks.special} text="One special character (@$!%*?&)" />
                            </div>
                        )}
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        disabled={loading || (password.length > 0 && !allValid)}
                        style={{ opacity: (password.length > 0 && !allValid) ? 0.5 : 1 }}
                    >
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                </form>

                <div className={styles.divider}>
                    <span>Already have an account?</span>
                </div>

                <Link href="/login" style={{ width: '100%', display: 'block' }}>
                    <Button variant="outline" size="lg" style={{ width: '100%' }}>
                        Sign In
                    </Button>
                </Link>
            </div>
        </div>
    );
}
