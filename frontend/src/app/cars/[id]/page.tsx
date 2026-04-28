                                                                                                                                                                                                                                                                                                                                                         import { getCarById } from "@/app/actions/cars";
import { Button } from "@/components/ui/Button/Button";
import QuickActions from "@/components/ui/QuickActions/QuickActions";
import Link from "next/link";
import styles from "./page.module.css";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

export default async function CarDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();
    const { data: car, error } = await getCarById(Number(id));

    if (error || !car) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumb}>
                <Link href="/">Home</Link> / <span>{car.make} {car.model}</span>
            </div>

            <div className={styles.grid}>
                <div className={styles.imageSection}>
                    {car.images ? (
                        <img src={car.images} alt={`${car.make} ${car.model}`} className={styles.image} />
                    ) : (
                        <div className={styles.placeholder}>No Image Available</div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.title}>{car.year} {car.make} {car.model}</h1>
                    <p className={styles.price}>${Number(car.price).toLocaleString()}</p>

                    <div className={styles.specs}>
                        <div className={styles.specItem}>
                            <span className={styles.label}>Mileage</span>
                            <span className={styles.value}>{car.mileage ? `${car.mileage.toLocaleString()} km` : 'N/A'}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>Condition</span>
                            <span className={styles.value}>{car.condition}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>Status</span>
                            <span className={styles.value}>{car.status}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>Listing Type</span>
                            <span className={styles.value}>{car.listingType}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>Reg Number</span>
                            <span className={styles.value}>{car.regNumber}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>Meter Reading</span>
                            <span className={styles.value}>{car.meterReading ? `${car.meterReading.toLocaleString()} km` : '0 km'}</span>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <h3>Description</h3>
                        <p>{car.description || "No description provided."}</p>
                    </div>

                    <div className={styles.actions}>
                        {session ? (
                            <Link href={`/dashboard/bookings/new?carId=${car.id}`} style={{ width: '100%' }}>
                                <Button size="lg" fullWidth>Book Now</Button>
                            </Link>
                        ) : (
                            <Link href={`/login?callbackUrl=${encodeURIComponent(`/dashboard/bookings/new?carId=${car.id}`)}`} style={{ width: '100%' }}>
                                <Button size="lg" fullWidth>Login to Book</Button>
                            </Link>
                        )}
                        
                        {car.status === 'AVAILABLE' && (
                            <Link href="/contact" style={{ width: '100%' }}>
                                <Button size="lg" variant="outline" fullWidth>تواصل معنا (Contact Us)</Button>
                            </Link>
                        )}
                        <QuickActions />
                    </div>
                </div>
            </div>
        </div>
    );
}
