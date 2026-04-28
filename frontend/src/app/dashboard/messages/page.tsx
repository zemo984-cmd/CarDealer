import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import styles from "../cars/new/page.module.css";
import { sendMessage } from "@/app/actions/messages";
import { Button } from "@/components/ui/Button/Button";

export default async function MessagesPage() {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            messagesReceived: {
                include: { sender: true },
                orderBy: { createdAt: 'desc' }
            },
            messagesSent: {
                include: { receiver: true },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!user) return redirect('/login');

    const isAdmin = user.role === 'ADMIN' || user.role === 'EMPLOYEE';

    // If customer, they send messages to the first ADMIN
    let adminId: number | null = null;
    if (!isAdmin) {
        const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (admin) adminId = admin.id;
    }

    async function handleSendMessage(formData: FormData) {
        "use server";
        await sendMessage(formData);
    }

    return (
        <div className={styles.container} dir="rtl">
            <h1 className={styles.title}>الرسائل</h1>

            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>صندوق الوارد</h3>
                    {user.messagesReceived.length === 0 ? (
                        <p style={{ color: '#94a3b8' }}>لا توجد رسائل واردة.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {user.messagesReceived.map(msg => (
                                <div key={msg.id} style={{ padding: '1rem', background: 'var(--card)', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                                        <strong>من: {msg.sender.name || msg.sender.email}</strong>
                                        <span>{new Date(msg.createdAt).toLocaleString()}</span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--foreground)' }}>{msg.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ flex: '1 1 300px' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--foreground)' }}>رسالة جديدة</h3>
                    <form action={handleSendMessage} className={styles.form}>
                        {isAdmin ? (
                            <div className={styles.group}>
                                <label>إلى (معرف العميل):</label>
                                <input type="number" name="receiverId" className={styles.input} required placeholder="أدخل رقم ID للعميل" />
                            </div>
                        ) : (
                            <input type="hidden" name="receiverId" value={adminId || ''} />
                        )}
                        <div className={styles.group}>
                            <label>نص الرسالة</label>
                            <textarea name="content" className={styles.input} rows={4} required placeholder="اكتب رسالتك هنا..."></textarea>
                        </div>
                        <Button type="submit">إرسال الرسالة</Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
