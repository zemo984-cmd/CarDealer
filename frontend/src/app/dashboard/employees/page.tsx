import { getEmployees } from "@/app/actions/org";
import { Button } from "@/components/ui/Button/Button";
import { Plus, Edit, Trash2 } from 'lucide-react';
import styles from "../cars/page.module.css";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getT } from "@/lib/server-translation";

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || role !== 'ADMIN') redirect('/dashboard');
    const t = await getT();

    const { data: employees } = await getEmployees();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('emp.title')}</h1>
                <Button>
                    <Plus size={16} style={{ marginRight: '8px' }} />
                    {t('emp.add')}
                </Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('emp.name')}</th>
                            <th>{t('emp.email')}</th>
                            <th>{t('emp.role')}</th>
                            <th>{t('emp.branch')}</th>
                            <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees?.map((emp) => (
                            <tr key={emp.id}>
                                <td><span className={styles.carName}>{emp.name || t('common.na')}</span></td>
                                <td>{emp.email}</td>
                                <td>
                                    <span className={`${styles.badge} ${emp.role === 'ADMIN' ? styles.reserved : styles.available}`}>
                                        {emp.role}
                                    </span>
                                </td>
                                <td>{emp.branch?.name || t('emp.unassigned')}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <Button size="sm" variant="ghost"><Edit size={16} /></Button>
                                        <Button size="sm" variant="destructive"><Trash2 size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!employees || employees.length === 0) && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                    {t('emp.none')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
