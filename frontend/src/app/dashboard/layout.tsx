import DashboardClientLayout from '@/components/dashboard/DashboardClientLayout';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session) {
        redirect('/login');
    }

    let userDb = null;
    let unreadCount = 0;
    if (session?.user?.email) {
        userDb = await prisma.user.findUnique({
            where: { email: session.user.email }
        });
        if (userDb) {
            unreadCount = await prisma.notification.count({
                where: { userId: userDb.id, isRead: false }
            });
        }
    }

    return (
        <DashboardClientLayout
            userName={session.user?.name || session.user?.email || 'User'}
            role={(session.user as any).role}
            profileImage={userDb?.profileImage}
            dashboardColor={userDb?.dashboardColor || undefined}
            unreadNotificationsCount={unreadCount}
        >
            {children}
        </DashboardClientLayout>
    );
}
