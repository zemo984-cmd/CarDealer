'use client';

import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import { Button } from '@/components/ui/Button/Button';
import styles from '../about/about.module.css'; // Reuse basic layout styles

export default function ContactPage() {
    const { t } = useTranslation();

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className={styles.title}>{t('contact.title')}</h1>
            </header>

            <div className={styles.contactGrid}>
                <div className={styles.infoColumn}>
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoTitle}>{t('contact.visit')}</h3>
                        <p className={styles.description}>123 Car Dealer Blvd, Auto City, AC 12345</p>
                    </div>
                    <div className={styles.infoCard}>
                        <h3 className={styles.infoTitle}>{t('contact.sales')}</h3>
                        <p className={styles.description}>Phone: (555) 123-4567</p>
                        <p className={styles.description}>Email: sales@automotive.com</p>
                    </div>
                </div>

                <form className={styles.form} onClick={(e) => e.preventDefault()}>
                    <h3 className={styles.infoTitle}>{t('contact.message')}</h3>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('contact.name')}</label>
                        <input type="text" className={styles.input} placeholder={t('contact.name')} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('contact.email')}</label>
                        <input type="email" className={styles.input} placeholder={t('contact.email')} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{t('contact.msg_placeholder')}</label>
                        <textarea rows={4} className={styles.textarea} placeholder={t('contact.msg_placeholder')} />
                    </div>
                    <Button fullWidth>{t('common.send')}</Button>
                </form>
            </div>
        </div>
    );
}
