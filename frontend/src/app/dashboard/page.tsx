import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import StatsCard from '@/components/ui/StatsCard';
import { Car, DollarSign, Users, ShoppingBag, Clock, ShieldCheck, Calendar } from 'lucide-react';
import styles from './page.module.css';
import { BarChartComponent } from '@/components/ui/Chart';

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect('/login');

    const role = (session.user as any).role;

    if (role === 'ADMIN') {
        return (
            <div>
                <h1 className={styles.title}>Admin Overview</h1>

                <div className={styles.grid}>
                    <StatsCard
                        title="Total Cars"
                        value="24"
                        icon={Car}
                        trend="+2 from last week"
                    />
                    <StatsCard
                        title="Total Revenue"
                        value="$84k"
                        icon={DollarSign}
                        trend="+15% from last month"
                    />
                    <StatsCard
                        title="New Customers"
                        value="34"
                        icon={Users}
                        trend="+2% from last month"
                    />
                    <StatsCard
                        title="Sales"
                        value="12"
                        icon={ShoppingBag}
                        trend="+4 from last month"
                    />
                </div>

                <div className={styles.chartsRow}>
                    <div className={styles.chartCard}>
                        <h3>Monthly Sales</h3>
                        <div className={styles.chartContainer}>
                            <BarChartComponent />
                        </div>
                    </div>
                    <div className={styles.chartCard}>
                        <h3>Recent System Activity</h3>
                        <ul className={styles.activityList}>
                            <li>
                                <span>New Car Added: BMW M5</span>
                                <span className={styles.time}>2 mins ago</span>
                            </li>
                            <li>
                                <span>Order #1024 - Pending</span>
                                <span className={styles.time}>1 hour ago</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // Client Dashboard
    return (
        <div>
            <h1 className={styles.title}>Welcome Back, {session.user?.name || 'Customer'}</h1>
            <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
                Manage your car bookings and account settings here.
            </p>

            <div className={styles.grid}>
                <StatsCard
                    title="My Bookings"
                    value="2"
                    icon={Calendar}
                />
                <StatsCard
                    title="Current Rentals"
                    value="1"
                    icon={Car}
                />
                <StatsCard
                    title="Account Status"
                    value="Verified"
                    icon={ShieldCheck}
                />
            </div>

            <div className={styles.chartsRow}>
                <div className={styles.chartCard} style={{ flex: 1 }}>
                    <h3>Recent Activity</h3>
                    <ul className={styles.activityList}>
                        <li>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <Clock size={16} />
                                <span>You booked a <strong>BMW 5 Series</strong> (2024)</span>
                            </div>
                            <span className={styles.time}>Dec 20, 2025</span>
                        </li>
                        <li>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <ShieldCheck size={16} />
                                <span>Password updated successfully</span>
                            </div>
                            <span className={styles.time}>2 days ago</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
