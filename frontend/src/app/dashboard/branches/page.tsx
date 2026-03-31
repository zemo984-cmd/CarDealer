import { getBranches } from "@/app/actions/org";
import { Button } from "@/components/ui/Button/Button";
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';
import styles from "../cars/page.module.css";

export const dynamic = 'force-dynamic';

export default async function BranchesPage() {
    const { data: branches } = await getBranches();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Branches</h1>
                <Button>
                    <Plus size={16} style={{ marginRight: '8px' }} />
                    Add Branch
                </Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Phone</th>
                            <th>Employees</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {branches?.map((branch) => (
                            <tr key={branch.id}>
                                <td>#{branch.id}</td>
                                <td><span className={styles.carName}>{branch.name}</span></td>
                                <td>{branch.address}</td>
                                <td>{branch.phone || 'N/A'}</td>
                                <td>{branch._count.user} Staff</td>
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
                                    No branches found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
