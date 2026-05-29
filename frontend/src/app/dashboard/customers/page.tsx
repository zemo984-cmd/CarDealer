import { getCustomers } from "@/app/actions/users";
import { Button } from "@/components/ui/Button/Button";
import styles from "../cars/page.module.css";
import { Mail, MoreHorizontal } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getT } from "@/lib/server-translation";

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'EMPLOYEE')) redirect('/dashboard');
    const t = await getT();

    const { data: customers } = await getCustomers();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('cust.title')}</h1>
                <Button>{t('cust.export')}</Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('cust.name')}</th>
                            <th>{t('cust.contact')}</th>
                            <th>{t('cust.role')}</th>
                            <th>{t('cust.orders')}</th>
                            <th>{t('cust.joined')}</th>
                            <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers?.map((customer) => (
                            <tr key={customer.id}>
                                <td>
                                    <div className={styles.carName}>{customer.name || t('common.na')}</div>
                                    <div className={styles.carId}>ID: #{customer.id}</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Mail size={14} />
                                            <span>{customer.email}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${styles.available}`}>{customer.role}</span>
                                </td>
                                <td>{customer._count.order} {t('cust.order_count')}</td>
                                <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <Button size="sm" variant="ghost"><MoreHorizontal size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!customers || customers.length === 0) && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                    {t('cust.none')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
