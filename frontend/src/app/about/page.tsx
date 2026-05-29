'use client';

import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import styles from './about.module.css';

export default function AboutPage() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className={styles.title}>{t('about.title')}</h1>
            </header>

            <main className={styles.content}>
                <div className={styles.textSection}>
                    <p className={styles.description}>
                        {t('about.description1')}
                    </p>
                    <p className={styles.description}>
                        {t('about.description2')}
                    </p>
                </div>
            </main>
        </div>
    );
}
