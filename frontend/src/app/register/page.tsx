'use client';

import { register } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from '@/context/TranslationContext';
import styles from '../login/page.module.css';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(formData: FormData) {
        const result = await register(formData);
        if (result && (result as any).error) {
            setError((result as any).error);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join our dealership management system</p>

                {error && (
                    <div style={{ color: 'var(--destructive)', backgroundColor: 'var(--destructive-foreground)', padding: '0.75rem', borderRadius: '0.375rem', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
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
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className={styles.input}
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
                    </div>

                    <Button type="submit" size="lg">Sign Up</Button>
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
