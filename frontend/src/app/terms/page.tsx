'use client';

import { useTranslation } from '@/context/TranslationContext';

export default function TermsOfServicePage() {
    const { t } = useTranslation();

    return (
        <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem', lineHeight: '1.6' }}>
            <h1 style={{ marginBottom: '2rem' }}>{t('terms_page.title')}</h1>
            <p><strong>{t('terms_page.effective_date')}</strong> {new Date().toLocaleDateString()}</p>
            <p style={{ marginTop: '1rem' }}>
                {t('terms_page.intro')}
            </p>
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>{t('terms_page.section1_title')}</h2>
            <p>
                {t('terms_page.section1_desc')}
            </p>
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>{t('terms_page.section2_title')}</h2>
            <p>
                {t('terms_page.section2_desc')}
            </p>
            <h2 style={{ marginTop: '2rem', marginBottom: '1rem' }}>{t('terms_page.section3_title')}</h2>
            <p>
                {t('terms_page.section3_desc')}
            </p>
        </div>
    );
}
