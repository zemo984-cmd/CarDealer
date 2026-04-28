import styles from "../cars/new/page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileForm, CustomerSettingsForm, AdminSettingsForm } from "./SettingsForms";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return <div>User not found</div>;

    const isAdmin = user.role === 'ADMIN' || user.role === 'EMPLOYEE';
    const settings = isAdmin ? await prisma.systemsetting.findMany() : [];

    return (
        <div className={styles.container} dir="rtl">
            <h1 className={styles.title}>الإعدادات الشاملة</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {/* 1. Basic Profile Form for everyone */}
                <ProfileForm user={user} />

                {/* 2. Customer Settings for CLIENTs */}
                {user.role === 'CLIENT' && (
                    <CustomerSettingsForm user={user} />
                )}

                {/* 3. System Admin Settings for ADMIN/EMPLOYEE */}
                {isAdmin && (
                    <AdminSettingsForm settings={settings} />
                )}
            </div>
        </div>
    );
}
