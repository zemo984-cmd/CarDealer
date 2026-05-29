'use client';

import { getCars } from "@/app/actions/cars";
import { CarCard } from "@/components/ui/CarCard/CarCard";
import { Button } from "@/components/ui/Button/Button";
import Link from "next/link";
import styles from "./page.module.css";
import { Shield, Clock, Award, ChevronDown, Star } from "lucide-react";
import { useTranslation } from "@/context/TranslationContext";
import { useState, useEffect } from "react";

const BRANDS_MARQUEE = [
  'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Ferrari', 'Lamborghini',
  'Tesla', 'Toyota', 'Ford', 'McLaren', 'Rolls-Royce', 'Bentley',
  'Aston Martin', 'Bugatti', 'Maserati', 'Lexus', 'Land Rover', 'Jaguar',
  'BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Ferrari', 'Lamborghini',
  'Tesla', 'Toyota', 'Ford', 'McLaren', 'Rolls-Royce', 'Bentley',
  'Aston Martin', 'Bugatti', 'Maserati', 'Lexus', 'Land Rover', 'Jaguar',
];

export default function Home() {
  const { t } = useTranslation();
  const [cars, setCars] = useState<any[]>([]);
  const [carsLoaded, setCarsLoaded] = useState(false);

  useEffect(() => {
    getCars({ limit: 6 }).then(res => {
      setCars(res.data || []);
      setCarsLoaded(true);
    });
  }, []);

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            <Star size={12} fill="currentColor" />
            #1 Luxury Car Dealer
          </div>
          <h1 className={styles.heroTitle}>
            Find Your{' '}
            <span className={styles.heroTitleAccent}>Perfect</span>
            <br />Dream Car
          </h1>
          <p className={styles.heroSubtitle}>
            {t('hero.subtitle')}
          </p>
          <div className={styles.heroButtons}>
            <Link href="/cars">
              <Button size="lg" variant="primary">{t('hero.cta')}</Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                {t('home.contact_us')}
              </Button>
            </Link>
          </div>

          <div className={styles.heroStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>120+</div>
              <div className={styles.statLabel}>Vehicles</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>30+</div>
              <div className={styles.statLabel}>Brands</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>5★</div>
              <div className={styles.statLabel}>Rated Service</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>Support</div>
            </div>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <ChevronDown size={18} />
          Scroll
        </div>
      </section>

      {/* ── Brands Marquee ── */}
      <div className={styles.brandsSection}>
        <div className={styles.brandsTrack}>
          {BRANDS_MARQUEE.map((brand, i) => (
            <Link key={i} href={`/cars?make=${encodeURIComponent(brand)}`}>
              <span className={styles.brandName}>{brand}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Why Choose Us ── */}
      <section id="about" className={styles.features}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Our Promise</span>
          <h2 className={styles.sectionTitle}>{t('home.why_choose_us')}</h2>
          <p className={styles.sectionSubtitle}>{t('home.why_subtitle')}</p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Shield size={28} /></div>
            <h3>{t('home.premium_quality')}</h3>
            <p>{t('home.premium_desc')}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Clock size={28} /></div>
            <h3>{t('home.fast_service')}</h3>
            <p>{t('home.fast_desc')}</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><Award size={28} /></div>
            <h3>{t('home.best_prices')}</h3>
            <p>{t('home.best_prices_desc')}</p>
          </div>
        </div>
      </section>

      {/* ── Featured Inventory ── */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionEyebrow}>Fresh Arrivals</span>
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
          ) : carsLoaded ? (
            <div className={styles.noResults}>
              <p>{t('home.no_cars')}</p>
            </div>
          ) : (
            // Skeleton placeholders while loading
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} style={{
                borderRadius: '1rem',
                overflow: 'hidden',
                background: 'var(--card)',
                border: '1px solid var(--border)',
                height: '360px',
              }}>
                <div style={{
                  width: '100%',
                  aspectRatio: '16/9',
                  background: 'var(--muted)',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }} />
              </div>
            ))
          )}
        </div>

        <div className={styles.viewAllBtn}>
          <Link href="/cars">
            <Button size="lg" variant="outline">{t('home.view_all')}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
