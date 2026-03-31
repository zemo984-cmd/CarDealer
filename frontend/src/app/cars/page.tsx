'use client';

import { getCars } from "@/app/actions/cars";
import Filter from "@/components/ui/Filter/Filter";
import { useTranslation } from "@/context/TranslationContext";
import styles from "./page.module.css";
import { Search, Filter as FilterIcon } from "lucide-react";
import { CarCard } from "@/components/ui/CarCard/CarCard";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function InventoryPage() {
    const { t } = useTranslation();
    const searchParams = useSearchParams();
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const keyword = searchParams.get('keyword') || '';
    const make = searchParams.get('make') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    useEffect(() => {
        setLoading(true);
        getCars({
            keyword,
            make,
            minPrice,
            maxPrice
        }).then(res => {
            setCars(res.data || []);
            setLoading(false);
        });
    }, [keyword, make, minPrice, maxPrice]);

    return (
        <div className={styles.page}>
            <aside className={styles.sidebar}>
                <Filter />
            </aside>
            <section className={styles.main}>
                <h1 className={styles.heading}>{t('nav.inventory')}</h1>
                {loading ? (
                    <div className={styles.loading}>{t('common.loading')}</div>
                ) : (
                    <div className={styles.grid}>
                        {cars && cars.length > 0 ? (
                            cars.map((car: any) => (
                                <div key={car.id} className={styles.gridItem}>
                                    <CarCard car={car} />
                                </div>
                            ))
                        ) : (
                            <div className={styles.noResults}>{t('home.no_cars')}</div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}
