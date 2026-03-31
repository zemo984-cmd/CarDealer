'use client';

import { getCars } from "@/app/actions/cars";
import { CarCard } from "@/components/ui/CarCard/CarCard";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import styles from "./page.module.css";
import { Car, Shield, Clock, Award } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useTranslation();
  const [cars, setCars] = useState<any[]>([]);

  useEffect(() => {
    getCars({ limit: 3 }).then(res => {
      setCars(res.data || []);
    });
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{t('hero.title')}</h1>
          <p className={styles.heroSubtitle}>
            {t('hero.subtitle')}
          </p>
          <div className={styles.heroButtons}>
            <Link href="/cars">
              <Button size="lg" variant="primary">{t('hero.cta')}</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" style={{ color: 'white', borderColor: 'white' }}>
                {t('home.contact_us')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('home.why_choose_us')}</h2>
          <p className={styles.sectionSubtitle}>{t('home.why_subtitle')}</p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Shield size={40} /></div>
            <h3>{t('home.premium_quality')}</h3>
            <p>{t('home.premium_desc')}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Clock size={40} /></div>
            <h3>{t('home.fast_service')}</h3>
            <p>{t('home.fast_desc')}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Award size={40} /></div>
            <h3>{t('home.best_prices')}</h3>
            <p>{t('home.best_prices_desc')}</p>
          </div>
        </div>
      </section>

      {/* Featured Inventory */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{t('home.featured_vehicles')}</h2>
          <p className={styles.sectionSubtitle}>{t('home.featured_subtitle')}</p>
        </div>

        <div className={styles.grid}>
          {cars && cars.length > 0 ? (
            cars.map((car) => (
              <div key={car.id}>
                <CarCard car={car} />
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>{t('home.no_cars')}</p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <Link href="/cars">
            <Button size="lg" variant="outline">{t('home.view_all')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
