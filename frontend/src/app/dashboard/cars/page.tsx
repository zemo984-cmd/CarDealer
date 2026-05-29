import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { DeleteCarButton } from '@/components/dashboard/CarActions';
import styles from './page.module.css';
import { getT } from '@/lib/server-translation';

export const dynamic = 'force-dynamic';

export default async function CarsInventoryPage() {
    const t = await getT();
    const cars = await prisma.car.findMany({
        where: { isDeleted: false },
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>{t('inv.title')}</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href="/dashboard/cars/trash">
                        <Button variant="ghost">
                            <Trash2 size={16} style={{ marginRight: '8px' }} />
                            {t('inv.trash')}
                        </Button>
                    </Link>
                    <Link href="/dashboard/cars/new">
                        <Button>
                            <Plus size={16} style={{ marginRight: '8px' }} />
                            {t('inv.add')}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>{t('inv.img')}</th>
                            <th>{t('inv.make_model')}</th>
                            <th>{t('inv.year')}</th>
                            <th>{t('inv.price')}</th>
                            <th>{t('inv.status')}</th>
                            <th>{t('inv.branch')}</th>
                            <th style={{ textAlign: 'right' }}>{t('common.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car.id}>
                                <td>
                                    <div className={styles.imagePlaceholder}>
                                        {car.images ? <img src={car.images} alt="car" /> : t('inv.no_img')}
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.carName}>{car.make} {car.model}</div>
                                    <div className={styles.carId}>ID: #{car.id}</div>
                                </td>
                                <td>{car.year}</td>
                                <td className={styles.price}>${Number(car.price).toLocaleString()}</td>
                                <td>
                                    <span className={`${styles.badge} ${styles[car.status.toLowerCase()]}`}>
                                        {car.status}
                                    </span>
                                </td>
                                <td>{t('inv.main_branch')}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <Link href={`/cars/${car.id}`} target="_blank">
                                            <Button size="sm" variant="ghost"><Eye size={16} /></Button>
                                        </Link>
                                        <Link href={`/dashboard/cars/${car.id}/edit`}>
                                            <Button size="sm" variant="ghost"><Edit size={16} /></Button>
                                        </Link>
                                        <DeleteCarButton id={car.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
