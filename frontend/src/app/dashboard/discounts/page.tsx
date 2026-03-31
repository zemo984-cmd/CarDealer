import { getDiscounts } from "@/app/actions/discounts";
import { Button } from "@/components/ui/Button/Button";
import styles from "../cars/page.module.css";
import { Tag, Plus, Percent } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function DiscountsPage() {
    const { data: discounts } = await getDiscounts();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Discounts & Offers</h1>
                <Link href="/dashboard/discounts/new">
                    <Button>
                        <Plus size={16} style={{ marginRight: '8px' }} />
                        Create Discount
                    </Button>
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Amount</th>
                            <th>Customer Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {discounts?.map((discount) => (
                            <tr key={discount.id}>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ backgroundColor: '#f0fdf4', color: '#166534', padding: '8px', borderRadius: '8px' }}>
                                            <Percent size={18} />
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '1.125rem' }}>${Number(discount.amount).toLocaleString()}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.badge}>{discount.customerType}</span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <Button size="sm" variant="ghost">Edit</Button>
                                        <Button size="sm" variant="ghost" style={{ color: '#ef4444' }}>Delete</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!discounts || discounts.length === 0) && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                    No discounts found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
