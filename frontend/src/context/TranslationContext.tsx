'use client';

import React, { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const translations: Record<string, any> = {
    en,
    ar,
    // Placeholders for others as requested (8 total)
    fr: en,
    es: en,
    de: en,
    it: en,
    tr: en,
    ru: en
};

type Language = 'en' | 'ar' | 'fr' | 'es' | 'de' | 'it' | 'tr' | 'ru';

interface TranslationContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

function TranslationContent({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const saved = localStorage.getItem('lang') as Language;
        const queryLang = searchParams.get('lang') as Language;

        if (queryLang && translations[queryLang]) {
            setLanguage(queryLang);
            if (queryLang !== saved) {
                localStorage.setItem('lang', queryLang);
            }
        } else if (saved && translations[saved]) {
            setLanguage(saved);
        }
    }, [searchParams]);

    useEffect(() => {
        // Update document attributes whenever language changes
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const handleSetLanguage = (lang: Language) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('lang', lang);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        // State and localStorage are updated via the useEffect listening to searchParams
    };

    const t = (key: string) => {
        const keys = key.split('.');
        let value = translations[language];
        for (const k of keys) {
            value = value?.[k];
        }
        return value || key;
    };

    return (
        <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={null}>
            <TranslationContent>
                {children}
            </TranslationContent>
        </Suspense>
    );
}

export const useTranslation = () => {
    const context = useContext(TranslationContext);
    if (!context) throw new Error('useTranslation must be used within TranslationProvider');
    return context;
};
