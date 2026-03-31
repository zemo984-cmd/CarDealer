import { getEmployees } from "@/app/actions/org";
import { Button } from "@/components/ui/Button/Button";
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import styles from "../cars/page.module.css";

export const dynamic = 'force-dynamic';

export default async function EmployeesPage() {
    const { data: employees } = await getEmployees();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Employees</h1>
                <Button>
                    <Plus size={16} style={{ marginRight: '8px' }} />
                    Add Employee
                </Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Branch</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees?.map((emp) => (
                            <tr key={emp.id}>
                                <td><span className={styles.carName}>{emp.name || 'N/A'}</span></td>
                                <td>{emp.email}</td>
                                <td>
                                    <span className={`${styles.badge} ${emp.role === 'ADMIN' ? styles.reserved : styles.available}`}>
                                        {emp.role}
                                    </span>
                                </td>
                                <td>{emp.branch?.name || 'Unassigned'}</td>
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
                                    No employees found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
