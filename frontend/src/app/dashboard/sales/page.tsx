import { getOrders } from "@/app/actions/orders";
import { Button } from "@/components/ui/Button/Button";
import Link from 'next/link';
import { Plus } from 'lucide-react';
import styles from "../cars/page.module.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getT } from "@/lib/server-translation";

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'EMPLOYEE')) redirect('/dashboard');
    const t = await getT();

    const { data: orders } = await getOrders();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('sales_page.title')}</h1>
                <Link href="/dashboard/sales/new">
                    <Button>
                        <Plus size={16} style={{ marginRight: '8px' }} />
                        {t('sales_page.new')}
                    </Button>
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('sales_page.order_id')}</th>
                            <th>{t('sales_page.customer')}</th>
                            <th>{t('sales_page.car')}</th>
                            <th>{t('sales_page.type')}</th>
                            <th>{t('sales_page.amount')}</th>
                            <th>{t('sales_page.status')}</th>
                            <th>{t('sales_page.date')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order) => (
                            <tr key={order.id}>
                                <td>#{order.id}</td>
                                <td>{order.user.name || order.user.email}</td>
                                <td>{order.car.make} {order.car.model} ({order.car.year})</td>
                                <td>
                                    <span className={`${styles.badge} ${styles[order.type.toLowerCase()]}`}>
                                        {order.type}
                                    </span>
                                </td>
                                <td className={styles.price}>${Number(order.totalAmount).toLocaleString()}</td>
                                <td>{order.status}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                        {(!orders || orders.length === 0) && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                    {t('sales_page.none')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
