import { getCustomers } from "@/app/actions/users";
import { Button } from "@/components/ui/Button/Button";
import styles from "../cars/page.module.css"; // Reuse table styles
import { Mail, Phone, MoreHorizontal } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CustomersPage() {
    const { data: customers } = await getCustomers();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Customers</h1>
                <Button>Export CSV</Button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Contact Info</th>
                            <th>Role</th>
                            <th>Orders</th>
                            <th>Joined Date</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers?.map((customer) => (
                            <tr key={customer.id}>
                                <td>
                                    <div className={styles.carName}>{customer.name || 'N/A'}</div>
                                    <div className={styles.carId}>ID: #{customer.id}</div>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Mail size={14} className="text-muted-foreground" />
                                            <span>{customer.email}</span>
                                        </div>
                                        {/* Placeholder for phone if added later */}
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${styles.available}`}>
                                        {customer.role}
                                    </span>
                                </td>
                                <td>{customer._count.order} Orders</td>
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
                                    No customers found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
