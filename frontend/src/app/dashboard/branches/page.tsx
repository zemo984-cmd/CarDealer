import { getBranches } from "@/app/actions/org";
import { Button } from "@/components/ui/Button/Button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import styles from "../cars/page.module.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getT } from "@/lib/server-translation";

export const dynamic = 'force-dynamic';

export default async function BranchesPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== 'ADMIN') redirect('/dashboard');
    const t = await getT();

    const { data: branches } = await getBranches();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('branch.title')}</h1>
                <Button>
                    <Plus size={16} style={{ marginRight: '8px' }} />
                    {t('branch.add')}
                </Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('branch.id')}</th>
                            <th>{t('branch.name')}</th>
                            <th>{t('branch.address')}</th>
                            <th>{t('branch.phone')}</th>
                            <th>{t('branch.employees')}</th>
                            <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches?.map((branch) => (
                            <tr key={branch.id}>
                                <td>#{branch.id}</td>
                                <td><span className={styles.carName}>{branch.name}</span></td>
                                <td>{branch.address}</td>
                                <td>{branch.phone || t('common.na')}</td>
                                <td>{branch._count.user} {t('branch.staff')}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <Button size="sm" variant="ghost"><Edit size={16} /></Button>
                                        <Button size="sm" variant="destructive"><Trash2 size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!branches || branches.length === 0) && (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                    {t('branch.none')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
