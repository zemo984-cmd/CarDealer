import { getTrashedCars } from "@/app/actions/cars";
import { Button } from "@/components/ui/Button/Button";
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import styles from '../page.module.css';
import { TrashActions } from "@/components/dashboard/TrashActions";

export const dynamic = 'force-dynamic';

export default async function TrashPage() {
    const { success, data: cars, error } = await getTrashedCars();

    if (!success) {
        return <div style={{ padding: '20px', color: '#ef4444' }}>Error loading trash: {error}</div>;
    }

    return (
        <div>
            <div className={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link href="/dashboard/cars">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft size={16} />
                        </Button>
                    </Link>
                    <h1 className={styles.title}>Deleted Cars (Trash)</h1>
                </div>
            </div>

            <div className={styles.tableContainer}>
                {cars && cars.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Make & Model</th>
                                <th>Year</th>
                                <th>Price</th>
                                <th>Deleted At</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car: any) => (
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
                                    <td>{car.deletedAt ? new Date(car.deletedAt).toLocaleDateString() : 'Unknown'}</td>
                                    <td>
                                        <TrashActions carId={car.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                        Trash is empty
                    </div>
                )}
            </div>
        </div>
    );
}
