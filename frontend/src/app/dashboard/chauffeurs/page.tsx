import { getChauffeurs } from "@/app/actions/chauffeurs";
import { Button } from "@/components/ui/Button/Button";
import styles from "../cars/page.module.css";
import { User, Mail, MapPin, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ChauffeursPage() {
    const { data: chauffeurs } = await getChauffeurs();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Chauffeurs</h1>
                <Link href="/dashboard/chauffeurs/new">
                    <Button>
                        <Plus size={16} style={{ marginRight: '8px' }} />
                        Add Chauffeur
                    </Button>
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Occupation</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chauffeurs?.map((chauffeur) => (
                            <tr key={chauffeur.id}>
                                <td>
                                    <div className={styles.carName}>{chauffeur.name}</div>
                                    <div className={styles.carId}>ID: #{chauffeur.id}</div>
                                </td>
                                <td>{chauffeur.occupation}</td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.875rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <Mail size={14} className="text-muted-foreground" />
                                            <span>{chauffeur.email}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={14} className="text-muted-foreground" />
                                            <span>{chauffeur.address}</span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className={`${styles.badge} ${chauffeur.status === 'Active' ? styles.available : styles.booked}`}>
                                        {chauffeur.status}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.actions}>
                                        <Button size="sm" variant="ghost">Edit</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!chauffeurs || chauffeurs.length === 0) && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                    No chauffeurs found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
