import { prisma } from "@/lib/prisma";
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';
import { DeleteCarButton } from '@/components/dashboard/CarActions';
import styles from './page.module.css';

export const dynamic = 'force-dynamic';

export default async function CarsInventoryPage() {
    const allCars = await prisma.car.findMany({
        orderBy: { createdAt: 'desc' } as any,
    });

    // Temporary workaround: Filter in JS because Prisma client hasn't updated yet
    const cars = (allCars as any[]).filter(car => car.isDeleted === false || car.isDeleted === 0);

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Car Inventory</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Link href="/dashboard/cars/trash">
                        <Button variant="ghost">
                            <Trash2 size={16} style={{ marginRight: '8px' }} />
                            Trash
                        </Button>
                    </Link>
                    <Link href="/dashboard/cars/new">
                        <Button>
                            <Plus size={16} style={{ marginRight: '8px' }} />
                            Add New Car
                        </Button>
                    </Link>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Make & Model</th>
                            <th>Year</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Branch</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cars.map((car) => (
                            <tr key={car.id}>
                                <td>
                                    <div className={styles.imagePlaceholder}>
                                        {car.images ? <img src={car.images} alt="car" /> : 'No Img'}
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
                                <td>Main Branch</td>
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
