'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';
import { requestPasswordReset } from '@/app/actions/auth-reset';
import styles from './page.module.css';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [pending, setPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPending(true);
        const formData = new FormData();
        formData.append('email', email);

        await requestPasswordReset(formData);
        setSubmitted(true);
        setPending(false);
    };

    return (
        <div className={styles.container} dir="rtl">
            <div className={styles.card}>
                <h1 className={styles.title}>استعادة كلمة السر</h1>

                {!submitted ? (
                    <>
                        <p className={styles.subtitle}>أدخل بريدك الإلكتروني لإعادة تعيين كلمة السر</p>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className={styles.input}
                                    required
                                    dir="ltr"
                                />
                            </div>
                            <Button fullWidth type="submit" disabled={pending}>
                                {pending ? 'جاري الإرسال...' : 'إرسال رابط الاستعادة'}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className={styles.successMessage}>
                        <div className={styles.icon}>✉️</div>
                        <h3>تم الإرسال!</h3>
                        <p> تحقق من "Terminal" (لأغراض التطوير) للحصول على الرابط.</p>
                        <Button fullWidth onClick={() => setSubmitted(false)} variant="outline">
                            المحاولة ببريد آخر
                        </Button>
                    </div>
                )}

                <div className={styles.backToLogin}>
                    <Link href="/login">العودة إلى تسجيل الدخول</Link>
                </div>
            </div>
        </div>
    );
}
