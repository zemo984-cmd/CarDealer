'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button/Button';
import QuickActions from '@/components/ui/QuickActions/QuickActions';
import styles from './page.module.css';
import { useTranslation } from '@/context/TranslationContext';

interface CarDetailClientProps {
    car: any;
    hasSession: boolean;
}

export default function CarDetailClient({ car, hasSession }: CarDetailClientProps) {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <div className={styles.breadcrumb}>
                <Link href="/">{t('car_detail.home')}</Link> / <span>{car.make} {car.model}</span>
            </div>

            <div className={styles.grid}>
                <div className={styles.imageSection}>
                    {car.images ? (
                        <img src={car.images} alt={`${car.make} ${car.model}`} className={styles.image} />
                    ) : (
                        <div className={styles.placeholder}>{t('car_detail.no_image')}</div>
                    )}
                </div>

                <div className={styles.infoSection}>
                    <h1 className={styles.title}>{car.year} {car.make} {car.model}</h1>
                    <p className={styles.price}>${Number(car.price).toLocaleString()}</p>

                    <div className={styles.specs}>
                        <div className={styles.specItem}>
                            <span className={styles.label}>{t('car_detail.mileage')}</span>
                            <span className={styles.value}>{car.mileage ? `${car.mileage.toLocaleString()} km` : t('common.na')}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>{t('car_detail.condition')}</span>
                            <span className={styles.value}>{car.condition}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>{t('car_detail.status')}</span>
                            <span className={styles.value}>{car.status}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>{t('car_detail.listing_type')}</span>
                            <span className={styles.value}>{car.listingType}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>{t('car_detail.reg_number')}</span>
                            <span className={styles.value}>{car.regNumber}</span>
                        </div>
                        <div className={styles.specItem}>
                            <span className={styles.label}>{t('car_detail.meter')}</span>
                            <span className={styles.value}>{car.meterReading ? `${car.meterReading.toLocaleString()} km` : '0 km'}</span>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <h3>{t('car_detail.description')}</h3>
                        <p>{car.description || t('car_detail.no_desc')}</p>
                    </div>

                    <div className={styles.actions}>
                        {hasSession ? (
                            <Link href={`/dashboard/bookings/new?carId=${car.id}`} style={{ width: '100%' }}>
                                <Button size="lg" fullWidth>{t('car_detail.book_now')}</Button>
                            </Link>
                        ) : (
                            <Link href={`/login?callbackUrl=${encodeURIComponent(`/dashboard/bookings/new?carId=${car.id}`)}`} style={{ width: '100%' }}>
                                <Button size="lg" fullWidth>{t('car_detail.login_to_book')}</Button>
                            </Link>
                        )}

                        {car.status === 'AVAILABLE' && (
                            <Link href="/contact" style={{ width: '100%' }}>
                                <Button size="lg" variant="outline" fullWidth>{t('car_detail.contact_us')}</Button>
                            </Link>
                        )}
                        <QuickActions />
                    </div>
                </div>
            </div>
        </div>
    );
}
