'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/Button/Button';
import { useTranslation } from '@/context/TranslationContext';
import styles from './Header.module.css';

export default function Header({ userName }: { userName?: string }) {
    const { t } = useTranslation();
    return (
        <header className={styles.header}>
            <div className={styles.actions}>
                <button className={styles.iconBtn} title="Notifications">
                    <Bell size={20} />
                </button>
                <div className={styles.user}>
                    <div className={styles.avatar}>
                        <User size={20} />
                    </div>
                    <span className={styles.userName}>{userName}</span>
                </div>
            </div>
        </header>
    );
}
