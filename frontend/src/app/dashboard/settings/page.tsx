import { Button } from "@/components/ui/Button/Button";
import styles from "../cars/new/page.module.css";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateSettings } from "@/app/actions/settings";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) return <div>User not found</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Settings</h1>

            <form action={updateSettings as any} className={styles.form}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>Profile Information</h3>
                <div className={styles.grid}>
                    <div className={styles.group}>
                        <label>Full Name</label>
                        <input name="name" defaultValue={user.name || ''} className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Email (Read Only)</label>
                        <input defaultValue={user.email} className={styles.input} disabled style={{ opacity: 0.7 }} />
                    </div>
                    <div className={styles.group}>
                        <label>Address</label>
                        <input name="address" defaultValue={user.address || ''} className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Occupation</label>
                        <input name="occupation" defaultValue={user.occupation || ''} className={styles.input} />
                    </div>
                </div>

                <div className={styles.fullWidth} style={{ marginTop: '2rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>Notifications (Coming Soon)</h3>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input type="checkbox" id="emailNotif" defaultChecked disabled />
                        <label htmlFor="emailNotif" style={{ margin: 0, opacity: 0.7 }}>Email Notifications for New Orders</label>
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button size="lg" type="submit">Save Changes</Button>
                </div>
            </form>
        </div>
    );
}
