'use client';

import React from 'react';
import { useTranslation } from '@/context/TranslationContext';
import styles from './LanguageSwitcher.module.css';
import { Globe } from 'lucide-react';

const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation();

    return (
        <div className={styles.container}>
            <Globe size={18} className={styles.icon} />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className={styles.select}
            >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
