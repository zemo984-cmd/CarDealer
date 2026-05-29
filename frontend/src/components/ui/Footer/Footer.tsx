'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { useTranslation } from '@/context/TranslationContext';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h3>AutoMotive</h3>
                    <p>{t('footer.tagline')}</p>
                </div>
                <div className={styles.column}>
                    <h4>{t('footer.links')}</h4>
                    <Link href="/">{t('nav.home')}</Link>
                    <Link href="/cars">{t('nav.inventory')}</Link>
                    <Link href="/about">{t('nav.about')}</Link>
                    <Link href="/contact">{t('nav.contact')}</Link>
                    <Link href="/dashboard">{t('nav.dashboard')}</Link>
                </div>
                <div className={styles.column}>
                    <h4>{t('footer.legal')}</h4>
                    <Link href="/privacy">{t('footer.privacy')}</Link>
                    <Link href="/terms">{t('footer.terms')}</Link>
                </div>
                <div className={styles.column}>
                    <p>&copy; {new Date().getFullYear()} AutoMotive. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
}
