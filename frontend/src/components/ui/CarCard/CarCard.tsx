import Link from 'next/link';
// import { Car } from '@prisma/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import styles from './CarCard.module.css';

interface CarCardProps {
    car: any;
}

export function CarCard({ car }: CarCardProps) {
    return (
        <Card className={styles.card}>
            <CardHeader className={styles.header}>
                <div className={styles.imagePlaceholder}>
                    {car.images ? (
                        <img src={car.images} alt={`${car.make} ${car.model}`} className={styles.image} />
                    ) : (
                        <div className={styles.placeholder}>No Image</div>
                    )}
                </div>
                <CardTitle>{car.make} {car.model} {car.year}</CardTitle>
                <CardDescription>{car.condition} - {car.mileage ? `${car.mileage} km` : 'N/A'}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className={styles.price}>
                    ${Number(car.price).toLocaleString()}
                </div>
                <p className={styles.status}>{car.status}</p>
            </CardContent>
            <CardFooter className={styles.footer}>
                <Link href={`/cars/${car.id}`} passHref style={{ width: '100%' }}>
                    <Button fullWidth>View Details</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
