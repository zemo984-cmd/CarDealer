'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button/Button';
import styles from './Filter.module.css';

export default function Filter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
    const [make, setMake] = useState(searchParams.get('make') || '');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

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

    return (
        <div className={styles.filterContainer}>
            <h3 className={styles.title}>Filter Cars</h3>

            <div className={styles.group}>
                <label>Search Keyword</label>
                <input
                    type="text"
                    placeholder="Search by model or make..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className={styles.input}
                />
            </div>
            <div className={styles.group}>
                <label>Make</label>
                <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className={styles.select}
                >
                    <option value="">All Makes</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="BMW">BMW</option>
                    <option value="Mercedes">Mercedes</option>
                    {/* Add more dynamically or statically */}
                </select>
            </div>

            <div className={styles.group}>
                <label>Price Range</label>
                <div className={styles.priceRow}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className={styles.input}
                    />
                </div>
            </div>

            <div className={styles.actions}>
                <Button onClick={handleFilter} fullWidth>Apply Filters</Button>
                <Button onClick={handleReset} variant="outline" fullWidth>Reset</Button>
            </div>
        </div>
    );
}
