import { getChauffeurs } from "@/app/actions/chauffeurs";
import { Button } from "@/components/ui/Button/Button";
import styles from "../cars/page.module.css";
import { Mail, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getT } from "@/lib/server-translation";

export const dynamic = 'force-dynamic';

export default async function ChauffeursPage() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'EMPLOYEE')) redirect('/dashboard');
    const t = await getT();

    const { data: chauffeurs } = await getChauffeurs();

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('chauf.title')}</h1>
                <Link href="/dashboard/chauffeurs/new">
                    <Button>
                        <Plus size={16} style={{ marginRight: '8px' }} />
                        {t('chauf.add')}
                    </Button>
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('chauf.name')}</th>
                            <th>{t('chauf.occ')}</th>
                            <th>{t('chauf.contact')}</th>
                            <th>{t('chauf.status')}</th>
                            <th>{t('common.actions')}</th>
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
                                            <Mail size={14} />
                                            <span>{chauffeur.email}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MapPin size={14} />
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
                                        <Button size="sm" variant="ghost">{t('chauf.edit')}</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {(!chauffeurs || chauffeurs.length === 0) && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--muted-foreground)' }}>
                                    {t('chauf.none')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
