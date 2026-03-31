'use server';

import { prisma } from '@/lib/prisma';
import Invoice from '@/components/dashboard/Invoice';
import styles from './page.module.css';

export default async function BillingPage() {
    const bills = await prisma.bill.findMany({
        include: {
            booking: {
                include: {
                    user: true,
                    car: true,
                }
            }
        },
        orderBy: { billDate: 'desc' }
    });

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Billing</h1>

            <div className={styles.invoiceList}>
                {bills.length === 0 ? (
                    <p>No invoices found.</p>
                ) : (
                    bills.map((bill) => {
                        const formattedBill = {
                            ...bill,
                            totalAmount: Number(bill.totalAmount),
                            discountAmount: Number(bill.discountAmount),
                            taxAmount: Number(bill.taxAmount),
                            advanceAmount: Number(bill.advanceAmount),
                            balanceAmount: Number(bill.balanceAmount),
                        };
                        return (
                            <div key={bill.id} className={styles.invoiceWrapper}>
                                <Invoice
                                    bill={formattedBill as any}
                                    customer={(bill.booking as any).user}
                                    car={bill.booking.car as any}
                                />
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
