'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import Link from 'next/link';
import { requestPasswordReset } from '@/app/actions/auth-reset';
import styles from './page.module.css';
import { useTranslation } from '@/context/TranslationContext';

export default function ForgotPasswordPage() {
    const { t, language } = useTranslation();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [pending, setPending] = useState(false);
    const isRtl = language === 'ar';

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
        <div className={styles.container} dir={isRtl ? 'rtl' : 'ltr'}>
            <div className={styles.card}>
                <h1 className={styles.title}>{t('forgot_password.title')}</h1>

                {!submitted ? (
                    <>
                        <p className={styles.subtitle}>{t('forgot_password.subtitle')}</p>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.inputGroup}>
                                <label className={styles.label}>{t('forgot_password.email')}</label>
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
                                {pending ? t('forgot_password.sending') : t('forgot_password.submit')}
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className={styles.successMessage}>
                        <div className={styles.icon}>✉️</div>
                        <h3>{t('forgot_password.sent_title')}</h3>
                        <p>{t('forgot_password.sent_msg')}</p>
                        <Button fullWidth onClick={() => setSubmitted(false)} variant="outline">
                            {t('forgot_password.try_another')}
                        </Button>
                    </div>
                )}

                <div className={styles.backToLogin}>
                    <Link href="/login">{t('forgot_password.back_to_login')}</Link>
                </div>
            </div>
        </div>
    );
}
