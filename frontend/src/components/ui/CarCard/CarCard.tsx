'use client';

import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card/Card';
import { Button } from '@/components/ui/Button/Button';
import styles from './CarCard.module.css';
import { useTranslation } from '@/context/TranslationContext';

interface CarCardProps {
    car: any;
}

export function CarCard({ car }: CarCardProps) {
    const { t } = useTranslation();
    const price = Number(car.price).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

    return (
        <Card className={styles.card}>
            <CardHeader className={styles.header}>
                <div className={styles.imageWrapper}>
                    {car.images ? (
                        <img
                            src={car.images}
                            alt={`${car.make} ${car.model}`}
                            className={styles.image}
                            loading="lazy"
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <span>No Image</span>
                        </div>
                    )}
                    <div className={styles.imageOverlay} />
                    <div className={styles.badges}>
                        <span className={`${styles.badge} ${car.condition === 'New' ? styles.badgeNew : styles.badgeUsed}`}>
                            {car.condition}
                        </span>
                        {car.listingType && (
                            <span className={styles.badgeListing}>
                                {car.listingType === 'SALE' ? t('car_card.for_sale') : t('car_card.for_rent')}
                            </span>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className={styles.content}>
                <div className={styles.makeModel}>
                    <span className={styles.make}>{car.make}</span>
                    <span className={styles.model}>{car.model}</span>
                </div>
                <div className={styles.year}>{car.year}</div>

                <div className={styles.metaRow}>
                    {car.vehicletype?.typeName && (
                        <span className={styles.metaTag}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                            {car.vehicletype.typeName}
                        </span>
                    )}
                    {car.mileage ? (
                        <span className={styles.metaTag}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                            {Number(car.mileage).toLocaleString()} km
                        </span>
                    ) : (
                        <span className={styles.metaTag}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            {t('car_card.ask_km')}
                        </span>
                    )}
                </div>

                <div className={styles.priceRow}>
                    <div className={styles.price}>{price}</div>
                    {car.status === 'AVAILABLE' ? (
                        <span className={styles.statusAvail}>● {t('car_card.available')}</span>
                    ) : (
                        <span className={styles.statusOther}>{car.status}</span>
                    )}
                </div>
            </CardContent>

            <CardFooter className={styles.footer}>
                <Link href={`/cars/${car.id}`} passHref style={{ width: '100%' }}>
                    <Button fullWidth>{t('car_card.view')}</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
