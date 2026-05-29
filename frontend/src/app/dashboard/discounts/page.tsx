import { getDiscounts } from "@/app/actions/discounts";
import { Button } from "@/components/ui/Button/Button";
import styles from "../cars/page.module.css";
import { Plus, Percent } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getT } from "@/lib/server-translation";

export const dynamic = 'force-dynamic';

export default async function DiscountsPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'EMPLOYEE')) redirect('/dashboard');
    const t = await getT();

    const { data: discounts } = await getDiscounts();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('disc.title')}</h1>
                <Link href="/dashboard/discounts/new">
                    <Button>
                        <Plus size={16} style={{ marginRight: '8px' }} />
                        {t('disc.create')}
                    </Button>
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('disc.amount')}</th>
                            <th>{t('disc.type')}</th>
                            <th>{t('common.actions')}</th>
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
                                        <Button size="sm" variant="ghost">{t('disc.edit')}</Button>
                                        <Button size="sm" variant="ghost" style={{ color: '#ef4444' }}>{t('disc.delete')}</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!discounts || discounts.length === 0) && (
                            <tr>
                                <td colSpan={3} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                    {t('disc.none')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
