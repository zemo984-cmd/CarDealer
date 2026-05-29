'use server';

import { prisma } from '@/lib/prisma';
import styles from '../cars/page.module.css';
import { ReceiptText } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import StatusUpdater from './StatusUpdater';
import { auth } from '@/auth';
import Link from 'next/link';
import { getT } from '@/lib/server-translation';

export default async function BillingPage() {
    const session = await auth();
    if (!session?.user) return <div>Unauthorized</div>;
    const t = await getT();

    const userEmail = session.user.email;
    const dbUser = await prisma.user.findUnique({ where: { email: userEmail! } });
    if (!dbUser) return <div>User not found</div>;

    const isAdmin = dbUser.role === 'ADMIN' || dbUser.role === 'EMPLOYEE';

    const bills = await prisma.bill.findMany({
        where: isAdmin ? {} : { booking: { customerId: dbUser.id } },
        include: {
            booking: {
                include: { user: true, car: true }
            }
        },
        orderBy: { billDate: 'desc' }
    });

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{isAdmin ? t('bill.admin_title') : t('bill.client_title')}</h1>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {!isAdmin && (
                        <Link href="/contact">
                            <Button variant="outline">{t('bill.contact')}</Button>
                        </Link>
                    )}
                    <Button>{t('bill.export')}</Button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('bill.num')}</th>
                            <th>{t('bill.buyer')}</th>
                            <th>{t('bill.car')}</th>
                            <th>{t('bill.total')}</th>
                            <th>{t('bill.tax')}</th>
                            <th>{t('bill.status')}</th>
                            <th>{t('bill.date')}</th>
                            <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill) => {
                            const customer = (bill.booking as any).user;
                            const car = (bill.booking as any).car;
                            return (
                                <tr key={bill.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <ReceiptText size={16} color="#94a3b8" />
                                            <strong>#{bill.id}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <strong style={{ color: 'var(--foreground)' }}>{customer?.name || t('bill.na')}</strong>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{customer?.email}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <strong>{car?.make} {car?.model}</strong>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{car?.regNumber}</span>
                                        </div>
                                    </td>
                                    <td>${Number(bill.totalAmount).toLocaleString()}</td>
                                    <td>${Number(bill.taxAmount).toLocaleString()}</td>
                                    <td>
                                        {isAdmin ? (
                                            <StatusUpdater billId={bill.id} currentStatus={bill.status} />
                                        ) : (
                                            <span className={`${styles.badge} ${bill.status === 'Paid' ? styles.available : styles.booked}`}>
                                                {bill.status}
                                            </span>
                                        )}
                                    </td>
                                    <td>{new Date(bill.billDate).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Button size="sm" variant="ghost">{t('bill.view')}</Button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {bills.length === 0 && (
                            <tr>
                                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    {t('bill.none')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
