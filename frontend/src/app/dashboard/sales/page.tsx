import { getOrders } from "@/app/actions/orders";
import { Button } from "@/components/ui/Button/Button";
import Link from 'next/link';
import { Plus, Eye } from 'lucide-react';
import styles from "../cars/page.module.css"; // Reuse table styles

export const dynamic = 'force-dynamic';

export default async function SalesPage() {
    const { data: orders } = await getOrders();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Sales</h1>
                <Link href="/dashboard/sales/new">
                    <Button>
                        <Plus size={16} style={{ marginRight: '8px' }} />
                        New Sale
                    </Button>
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Car</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
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
                                    No orders found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
