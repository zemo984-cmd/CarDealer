import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
            <Sidebar role={(session.user as any).role} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Header userName={session.user?.name || session.user?.email || 'User'} />
                <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: 'var(--secondary)' }}>
                    {children}
                </main>
            </div>
        </div>
    );
}
