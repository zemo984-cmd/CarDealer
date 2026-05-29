import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import StatsCard from '@/components/ui/StatsCard';
import { Car, DollarSign, Users, ShoppingBag, Clock, ShieldCheck, Calendar } from 'lucide-react';
import styles from './page.module.css';
import { BarChartComponent } from '@/components/ui/Chart';
import { getT } from '@/lib/server-translation';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');
    const t = await getT();

    const role = (session.user as any).role;

    if (role === 'ADMIN' || role === 'EMPLOYEE') {
        const [totalCars, totalCustomers, totalSales, recentOrders] = await Promise.all([
            prisma.car.count({ where: { isDeleted: false } }),
            prisma.user.count({ where: { role: 'CLIENT' } }),
            prisma.order.count({ where: { status: 'COMPLETED' } }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { car: true, user: true },
            }),
        ]);

        const revenueResult = await prisma.order.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { totalAmount: true },
        });
        const totalRevenue = Number(revenueResult._sum.totalAmount || 0);

        return (
            <div>
                <h1 className={styles.title}>
                    {role === 'ADMIN' ? t('dash.admin_title') : t('dash.employee_title')}
                </h1>

                <div className={styles.grid}>
                    <StatsCard title={t('dash.total_cars')} value={totalCars.toString()} icon={Car} />
                    <StatsCard title={t('dash.revenue')} value={`$${(totalRevenue / 1000).toFixed(0)}k`} icon={DollarSign} />
                    <StatsCard title={t('dash.customers')} value={totalCustomers.toString()} icon={Users} />
                    <StatsCard title={t('dash.completed')} value={totalSales.toString()} icon={ShoppingBag} />
                </div>

                <div className={styles.chartsRow}>
                    <div className={styles.chartCard}>
                        <h3>{t('dash.monthly')}</h3>
                        <div className={styles.chartContainer}>
                            <BarChartComponent />
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3>{t('dash.recent_orders')}</h3>
                        <ul className={styles.activityList}>
                            {recentOrders.map((order) => (
                                <li key={order.id}>
                                    <span>{order.user.name || order.user.email} — {order.car.make} {order.car.model}</span>
                                    <span className={styles.time}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                </li>
                            ))}
                            {recentOrders.length === 0 && (
                                <li><span>{t('dash.no_orders')}</span></li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // Client Dashboard
    const userEmail = session.user?.email;
    const dbUser = userEmail ? await prisma.user.findUnique({ where: { email: userEmail } }) : null;

    const [myBookings, myOrders] = dbUser
        ? await Promise.all([
            prisma.booking.count({ where: { customerId: dbUser.id } }),
            prisma.order.count({ where: { userId: dbUser.id } }),
        ])
        : [0, 0];

    const activeBooking = dbUser
        ? await prisma.booking.count({
            where: { customerId: dbUser.id, status: { in: ['PENDING', 'CONFIRMED'] } },
        })
        : 0;

    return (
        <div>
            <h1 className={styles.title}>{t('dash.welcome')}, {session.user?.name || 'Customer'}</h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
                {t('dash.manage')}
            </p>

            <div className={styles.grid}>
                <StatsCard title={t('dash.my_bookings')} value={myBookings.toString()} icon={Calendar} />
                <StatsCard title={t('dash.rentals')} value={activeBooking.toString()} icon={Car} />
                <StatsCard title={t('dash.account')} value={dbUser?.status || 'Active'} icon={ShieldCheck} />
            </div>

            <div className={styles.chartsRow}>
                <div className={styles.chartCard} style={{ flex: 1 }}>
                    <h3>{t('dash.activity')}</h3>
                    <ul className={styles.activityList}>
                        <li>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <ShoppingBag size={16} />
                                <span>{t('dash.total_orders')}: <strong>{myOrders}</strong></span>
                            </div>
                        </li>
                        <li>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Clock size={16} />
                                <span>{t('dash.active_rentals')}: <strong>{activeBooking}</strong></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
