'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '../Button/Button';
import { Moon, Sun, ArrowRight, ArrowLeft } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { LanguageSwitcher } from '../LanguageSwitcher/LanguageSwitcher';
import styles from './Navbar.module.css';
import { useTranslation } from '@/context/TranslationContext';

interface NavbarProps {
    user?: any;
}

export default function Navbar({ user }: NavbarProps) {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className={styles.themeBtn}
                        title={t('nav.back')}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <Link href="/" className={styles.logo}>
                        AutoMotive
                    </Link>
                </div>
                <div className={styles.links}>
                    <Link href="/" className={styles.link}>{t('nav.home')}</Link>
                    <Link href="/cars" className={styles.link}>{t('nav.inventory')}</Link>
                    <Link href="/about" className={styles.link}>{t('nav.about')}</Link>
                    <Link href="/contact" className={styles.link}>{t('nav.contact')}</Link>
                    <Link href="/dashboard" className={styles.link}>{t('nav.dashboard')}</Link>
                </div>
                <div className={styles.actions}>
                    <LanguageSwitcher />
                    <Button variant="ghost" onClick={toggleTheme} className={styles.themeBtn}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </Button>
                    {!user ? (
                        <Link href="/login" className={styles.loginBtn}>{t('nav.login')}</Link>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={async () => {
                                await signOut({ redirect: false });
                                if (pathname.startsWith('/dashboard')) {
                                    router.push('/');
                                } else {
                                    router.refresh();
                                }
                            }}
                            className={styles.logoutBtn}
                        >
                            {t('nav.logout')}
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
