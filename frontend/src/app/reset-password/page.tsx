'use client';

import React, { useState, Suspense } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { useSearchParams } from 'next/navigation';
import { resetPassword } from '@/app/actions/auth-reset';
import styles from './page.module.css'; // Reusing similar styles or I should create new ones? I'll reuse login styles if possible or create simple one. 
// Actually I don't have styles/ResetPassword.module.css. I'll use inline or reuse login/page.module.css?
// The file path for login css is src/app/login/page.module.css. I can import it if I adjust paths, but css modules are local.
// I will create a new css module for reset password or just inline styles for simplicity? User wants "Interactive page".
// Better to create a module.

// I'll assume I can copy login/page.module.css structure.
import Link from 'next/link';
// I will use a new css file.

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [pending, setPending] = useState(false);

    if (!token) {
        return (
            <div className={styles.errorCard}>
                <h3>رابط غير صالح</h3>
                <p>رمز إعادة التعيين مفقود.</p>
                <Link href="/forgot-password"><Button>طلب رابط جديد</Button></Link>
            </div>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage('كلمات المرور غير متطابقة');
            return;
        }

        setPending(true);
        const formData = new FormData();
        formData.append('token', token);
        formData.append('password', password);
        formData.append('confirmPassword', confirmPassword);

        const result = await resetPassword(formData);
        if (result?.error) {
            setMessage(result.error);
        } else {
            // Redirect happens in action, but if we stay here:
            setMessage('تم تغيير كلمة السر بنجاح! جاري تحويلك...');
        }
        setPending(false);
    };

    return (
        <div className={styles.card}>
            <h1 className={styles.title}>تعيين كلمة مرور جديدة</h1>
            <p className={styles.subtitle}>الرجاء إدخال كلمة مرور قوية</p>

            {message && <div className={styles.alert}>{message}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label>كلمة المرور الجديدة</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={styles.input}
                        required
                        dir="ltr"
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>تأكيد كلمة المرور</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className={styles.input}
                        required
                        dir="ltr"
                    />
                </div>
                <Button fullWidth type="submit" disabled={pending}>
                    {pending ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
                </Button>
            </form>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className={styles.container} dir="rtl">
            <Suspense fallback={<div>Loading...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
