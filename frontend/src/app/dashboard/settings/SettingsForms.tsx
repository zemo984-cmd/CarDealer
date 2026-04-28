'use client';

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import styles from "../cars/new/page.module.css";
import { updateProfile, updateCustomerSettings, updateAdminSettings } from "@/app/actions/settings";
import { useTranslation } from "@/context/TranslationContext";

export function ProfileForm({ user }: { user: any }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        await updateProfile(formData);
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className={styles.form}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>المعلومات الشخصية</h3>
            <div className={styles.grid}>
                <div className={styles.group}>
                    <label>الاسم الكامل</label>
                    <input name="name" defaultValue={user.name || ''} className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>صورة الملف الشخصي (رابط الصورة)</label>
                    <input name="profileImage" defaultValue={user.profileImage || ''} placeholder="https://example.com/image.jpg" className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>البريد الإلكتروني (غير قابل للتعديل)</label>
                    <input defaultValue={user.email} className={styles.input} disabled style={{ opacity: 0.7 }} />
                </div>
                <div className={styles.group}>
                    <label>العنوان</label>
                    <input name="address" defaultValue={user.address || ''} className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>المهنة</label>
                    <input name="occupation" defaultValue={user.occupation || ''} className={styles.input} />
                </div>
            </div>
            <div className={styles.actions}>
                <Button size="lg" type="submit" disabled={loading}>
                    {loading ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                </Button>
            </div>
        </form>
    );
}

export function CustomerSettingsForm({ user }: { user: any }) {
    const [loading, setLoading] = useState(false);
    const [notifEnabled, setNotifEnabled] = useState(user.notificationsEnabled ?? true);
    const [colorBlind, setColorBlind] = useState(user.colorBlindMode ?? false);
    const [dashboardColor, setDashboardColor] = useState(user.dashboardColor || '#ffffff');

    async function handleSubmit() {
        setLoading(true);
        const fd = new FormData();
        fd.append('notificationsEnabled', notifEnabled ? 'true' : 'false');
        fd.append('colorBlindMode', colorBlind ? 'true' : 'false');
        fd.append('dashboardColor', dashboardColor);
        await updateCustomerSettings(fd);
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className={styles.form} style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>إعدادات العميل والتفضيلات</h3>
            <div className={styles.grid}>
                <div className={styles.group}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={notifEnabled} onChange={(e) => setNotifEnabled(e.target.checked)} />
                        تفعيل استلام الإشعارات عند الطلب والتحديثات
                    </label>
                </div>
                <div className={styles.group}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                        <input type="checkbox" checked={colorBlind} onChange={(e) => setColorBlind(e.target.checked)} />
                        وضع عمى الألوان (زيادة التباين)
                    </label>
                </div>
                <div className={styles.group}>
                    <label>اللون المفضل للوحة التحكم</label>
                    <input type="color" value={dashboardColor} onChange={(e) => setDashboardColor(e.target.value)}
                        style={{ padding: '0', cursor: 'pointer', height: '40px', width: '100%', border: 'none', borderRadius: '4px' }} />
                </div>
            </div>
            <div className={styles.actions}>
                <Button size="lg" type="submit" disabled={loading}>
                    {loading ? 'جاري الحفظ...' : 'حفظ التفضيلات'}
                </Button>
            </div>
        </form>
    );
}

export function AdminSettingsForm({ settings }: { settings: any[] }) {
    const [loading, setLoading] = useState(false);
    const taxRateSet = settings.find(s => s.key === 'TAX_RATE')?.value || '15';
    const siteColorSet = settings.find(s => s.key === 'SITE_COLOR')?.value || '#22c55e';

    const [taxRate, setTaxRate] = useState(taxRateSet);
    const [siteColor, setSiteColor] = useState(siteColorSet);

    async function handleSubmit() {
        setLoading(true);
        const fd = new FormData();
        fd.append('taxRate', taxRate);
        fd.append('primaryColor', siteColor);
        await updateAdminSettings(fd);
        setLoading(false);
    }

    return (
        <form action={handleSubmit} className={styles.form} style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>إعدادات النظام العامة (للمسؤولين)</h3>
            <div className={styles.grid}>
                <div className={styles.group}>
                    <label>نسبة الضريبة الافتراضية (%)</label>
                    <input 
                        type="number" 
                        min="0" 
                        max="100" 
                        value={taxRate} 
                        onChange={(e) => setTaxRate(e.target.value)} 
                        className={styles.input} 
                    />
                </div>
                <div className={styles.group}>
                    <label>اللون الأساسي للموقع (المظهر)</label>
                    <input type="color" value={siteColor} onChange={(e) => setSiteColor(e.target.value)}
                        style={{ padding: '0', cursor: 'pointer', height: '40px', width: '100%', border: 'none', borderRadius: '4px' }} />
                </div>
            </div>
            <div className={styles.actions}>
                <Button size="lg" type="submit" disabled={loading}>
                    {loading ? 'جاري الحفظ...' : 'حفظ إعدادات النظام'}
                </Button>
            </div>
        </form>
    );
}
