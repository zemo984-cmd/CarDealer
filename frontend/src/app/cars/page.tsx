'use client';

import { getCars } from "@/app/actions/cars";
import Filter from "@/components/ui/Filter/Filter";
import { useTranslation } from "@/context/TranslationContext";
import styles from "./page.module.css";
import { CarCard } from "@/components/ui/CarCard/CarCard";
import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const POPULAR_BRANDS = [
    { name: "All", logo: null },
    { name: "Alfa Romeo", logo: "https://logo.clearbit.com/alfaromeo.com" },
    { name: "Aston Martin", logo: "https://logo.clearbit.com/astonmartin.com" },
    { name: "Audi", logo: "https://logo.clearbit.com/audi.com" },
    { name: "Bentley", logo: "https://logo.clearbit.com/bentley.com" },
    { name: "BMW", logo: "https://logo.clearbit.com/bmw.com" },
    { name: "Bugatti", logo: "https://logo.clearbit.com/bugatti.com" },
    { name: "Chevrolet", logo: "https://logo.clearbit.com/chevrolet.com" },
    { name: "Dodge", logo: "https://logo.clearbit.com/dodge.com" },
    { name: "Ferrari", logo: "https://logo.clearbit.com/ferrari.com" },
    { name: "Ford", logo: "https://logo.clearbit.com/ford.com" },
    { name: "Honda", logo: "https://logo.clearbit.com/honda.com" },
    { name: "Hyundai", logo: "https://logo.clearbit.com/hyundai.com" },
    { name: "Jaguar", logo: "https://logo.clearbit.com/jaguar.com" },
    { name: "Kia", logo: "https://logo.clearbit.com/kia.com" },
    { name: "Lamborghini", logo: "https://logo.clearbit.com/lamborghini.com" },
    { name: "Land Rover", logo: "https://logo.clearbit.com/landrover.com" },
    { name: "Lexus", logo: "https://logo.clearbit.com/lexus.com" },
    { name: "Maserati", logo: "https://logo.clearbit.com/maserati.com" },
    { name: "Mazda", logo: "https://logo.clearbit.com/mazda.com" },
    { name: "McLaren", logo: "https://logo.clearbit.com/mclaren.com" },
    { name: "Mercedes-Benz", logo: "https://logo.clearbit.com/mercedes-benz.com" },
    { name: "Nissan", logo: "https://logo.clearbit.com/nissan.com" },
    { name: "Porsche", logo: "https://logo.clearbit.com/porsche.com" },
    { name: "Rolls-Royce", logo: "https://logo.clearbit.com/rolls-roycemotorcars.com" },
    { name: "Skoda", logo: "https://logo.clearbit.com/skoda-auto.com" },
    { name: "Subaru", logo: "https://logo.clearbit.com/subaru.com" },
    { name: "Tesla", logo: "https://logo.clearbit.com/tesla.com" },
    { name: "Toyota", logo: "https://logo.clearbit.com/toyota.com" },
    { name: "Volkswagen", logo: "https://logo.clearbit.com/vw.com" },
    { name: "Volvo", logo: "https://logo.clearbit.com/volvocars.com" },
];

export default function InventoryPage() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const router = useRouter();
    const brandBarRef = useRef<HTMLDivElement>(null);
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetching, setFetching] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const isFirstLoad = useRef(true);

    const keyword = searchParams.get('keyword') || '';
    const make = searchParams.get('make') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    const handleBrandClick = (brandName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (brandName && brandName !== 'All') {
            params.set('make', brandName);
        } else {
            params.delete('make');
        }
        router.push(`/cars?${params.toString()}`);
    };

    useEffect(() => {
        if (isFirstLoad.current) {
            setLoading(true);
            isFirstLoad.current = false;
        } else {
            setFetching(true);
        }
        getCars({ keyword, make, minPrice, maxPrice }).then(res => {
            const data = res.data || [];
            setCars(data);
            setTotalCount(data.length);
            setLoading(false);
            setFetching(false);
        });
    }, [keyword, make, minPrice, maxPrice]);

    // Scroll active brand into view
    useEffect(() => {
        if (brandBarRef.current && make) {
            const activeBtn = brandBarRef.current.querySelector('[data-active="true"]') as HTMLElement;
            if (activeBtn) {
                activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }, [make]);

    return (
        <div className={styles.page}>
            <aside className={styles.sidebar}>
                <Filter />
            </aside>
            <section className={styles.main}>
                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.heading}>{make ? make : t('cars_page.inventory')}</h1>
                        {!loading && (
                            <p className={styles.subheading}>
                                {totalCount > 0 ? (
                                    <>{totalCount} {totalCount !== 1 ? t('cars_page.vehicles') : t('cars_page.vehicle')} {make ? `${t('cars_page.from')} ${make}` : t('cars_page.available')}</>
                                ) : (
                                    <>{t('cars_page.no_vehicles')}</>
                                )}
                            </p>
                        )}
                    </div>
                    {(keyword || make || minPrice || maxPrice) && (
                        <button
                            className={styles.clearBtn}
                            onClick={() => router.push('/cars')}
                        >
                            {t('cars_page.clear')}
                        </button>
                    )}
                </div>

                <div className={styles.brandBar} ref={brandBarRef}>
                    {POPULAR_BRANDS.map((b) => {
                        const isActive = (b.name === "All" && !make) || make === b.name;
                        return (
                            <button
                                key={b.name}
                                data-active={isActive}
                                className={`${styles.brandButton} ${isActive ? styles.activeBrand : ''}`}
                                onClick={() => handleBrandClick(b.name)}
                            >
                                {b.logo ? (
                                    <img
                                        src={b.logo}
                                        alt={b.name}
                                        className={styles.brandLogo}
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                    />
                                ) : (
                                    <svg className={styles.brandLogo} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                                    </svg>
                                )}
                                {b.name}
                            </button>
                        );
                    })}
                </div>

                {loading ? (
                    <div className={styles.loadingGrid}>
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className={styles.skeleton}>
                                <div className={styles.skeletonImg} />
                                <div className={styles.skeletonContent}>
                                    <div className={styles.skeletonLine} style={{ width: '40%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '70%' }} />
                                    <div className={styles.skeletonLine} style={{ width: '30%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={`${styles.grid} ${fetching ? styles.gridFetching : ''}`}>
                        {cars && cars.length > 0 ? (
                            cars.map((car: any) => (
                                <div key={car.id} className={styles.gridItem}>
                                    <CarCard car={car} />
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>
                                <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
                                </svg>
                                <p>{t('cars_page.no_match')}</p>
                                <button className={styles.resetLink} onClick={() => router.push('/cars')}>{t('cars_page.clear_all')}</button>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
