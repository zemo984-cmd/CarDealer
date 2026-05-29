'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import styles from './Filter.module.css';
import { useTranslation } from '@/context/TranslationContext';

const MAKES = [
    'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti',
    'Chevrolet', 'Dodge', 'Ferrari', 'Ford', 'Honda', 'Hyundai',
    'Jaguar', 'Jeep', 'Kia', 'Lamborghini', 'Land Rover', 'Lexus',
    'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'Nissan', 'Porsche',
    'Rivian', 'Rolls-Royce', 'Skoda', 'Subaru', 'Tesla', 'Toyota',
    'Volkswagen', 'Volvo'
];

export default function Filter() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [make, setMake] = useState(searchParams.get('make') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const hasFilters = keyword || make || minPrice || maxPrice;

    const handleFilter = () => {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (make) params.set('make', make);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        router.push(`/cars?${params.toString()}`);
    };

    const handleReset = () => {
        setKeyword('');
        setMake('');
        setMinPrice('');
        setMaxPrice('');
        router.push('/cars');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleFilter();
    };

    return (
        <div className={styles.filterContainer}>
            <div className={styles.titleRow}>
                <svg className={styles.titleIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                <h3 className={styles.title}>{t('filter.title')}</h3>
            </div>

            {hasFilters && (
                <div className={styles.activeFiltersRow}>
                    {keyword && (
                        <span className={styles.activeTag} onClick={() => { setKeyword(''); }}>
                            🔍 {keyword} ×
                        </span>
                    )}
                    {make && (
                        <span className={styles.activeTag} onClick={() => { setMake(''); }}>
                            🚗 {make} ×
                        </span>
                    )}
                    {(minPrice || maxPrice) && (
                        <span className={styles.activeTag} onClick={() => { setMinPrice(''); setMaxPrice(''); }}>
                            💰 {minPrice || '0'} – {maxPrice || '∞'} ×
                        </span>
                    )}
                </div>
            )}

            <div className={styles.group}>
                <label>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    {t('filter.search')}
                </label>
                <input
                    type="text"
                    placeholder={t('filter.search_ph')}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={styles.input}
                />
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
                <label>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    {t('filter.make')}
                </label>
                <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className={styles.select}
                >
                    <option value="">{t('filter.all_makes')}</option>
                    {MAKES.map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            <div className={styles.divider} />

            <div className={styles.group}>
                <label>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    {t('filter.price')}
                </label>
                <div className={styles.priceRow}>
                    <input
                        type="number"
                        placeholder="Min $"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className={styles.input}
                        min={0}
                    />
                    <span className={styles.priceSep}>–</span>
                    <input
                        type="number"
                        placeholder="Max $"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className={styles.input}
                        min={0}
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <Button onClick={handleFilter} fullWidth>{t('filter.apply')}</Button>
                {hasFilters && (
                    <Button onClick={handleReset} variant="outline" fullWidth>{t('filter.reset')}</Button>
                )}
            </div>
        </div>
    );
}
