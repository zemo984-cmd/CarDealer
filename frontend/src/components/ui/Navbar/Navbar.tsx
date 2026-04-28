'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '../Button/Button';
import { Moon, Sun, ArrowLeft, Menu, X } from 'lucide-react';
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
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);
    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Button
                        variant="ghost"
                        onClick={() => router.back()}
                        className={styles.backBtn}
                        title={t('nav.back')}
                    >
                        <ArrowLeft size={20} />
                    </Button>
                    <Link href="/" className={styles.logo}>
                        AutoMotive
                    </Link>
                </div>

                {/* Desktop Links */}
                <div className={styles.links}>
                    <Link href="/" className={styles.link}>{t('nav.home')}</Link>
                    <Link href="/cars" className={styles.link}>{t('nav.inventory')}</Link>
                    <Link href="/about" className={styles.link}>{t('nav.about')}</Link>
                    <Link href="/contact" className={styles.link}>{t('nav.contact')}</Link>
                    <Link href="/dashboard" className={styles.link}>{t('nav.dashboard')}</Link>
                </div>

                <div className={styles.actions}>
                    <div className={styles.desktopActions}>
                        {!user ? (
                            <Link href="/login" className={styles.loginBtn}>{t('nav.login')}</Link>
                        ) : (
                            <div className={styles.profileDropdownContainer}>
                                <button className={styles.profileTrigger} onClick={toggleDropdown}>
                                    <div className={styles.avatar}>
                                        {user.image ? (
                                            <img src={user.image} alt={user.name || 'User'} className={styles.avatarImage} />
                                        ) : (
                                            <span className={styles.avatarFallback}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                                        )}
                                    </div>
                                </button>
                                {isDropdownOpen && (
                                    <div className={styles.dropdownMenu}>
                                        <div className={styles.dropdownHeader}>
                                            <div className={styles.dropdownAvatar}>
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name || 'User'} className={styles.avatarImage} />
                                                ) : (
                                                    <span className={styles.avatarFallback}>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span>
                                                )}
                                            </div>
                                            <span className={styles.dropdownName}>{user.name || 'User'}</span>
                                        </div>
                                        <div className={styles.dropdownDivider}></div>
                                        <button
                                            onClick={async () => {
                                                await signOut({ redirect: false });
                                                if (pathname.startsWith('/dashboard')) {
                                                    router.push('/');
                                                } else {
                                                    router.refresh();
                                                }
                                            }}
                                            className={styles.dropdownItem}
                                        >
                                            {t('nav.logout')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Shared Actions for Mobile & Desktop */}
                    <div className={styles.sharedActions}>
                        <LanguageSwitcher />
                        <Button variant="ghost" onClick={toggleTheme} className={styles.themeBtn}>
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </Button>
                    </div>

                    <button className={styles.menuBtn} onClick={toggleMenu} aria-label="Toggle Menu">
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <>
                    <div className={styles.drawerBackdrop} onClick={closeMenu} />
                    <div className={styles.mobileDrawer}>
                        <div className={styles.drawerHeader}>
                            <span className={styles.logo}>AutoMotive</span>
                            <button className={styles.closeBtn} onClick={closeMenu}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className={styles.mobileNav}>
                            <Link href="/" className={styles.mobileLink} onClick={closeMenu}>{t('nav.home')}</Link>
                            <Link href="/cars" className={styles.mobileLink} onClick={closeMenu}>{t('nav.inventory')}</Link>
                            <Link href="/about" className={styles.mobileLink} onClick={closeMenu}>{t('nav.about')}</Link>
                            <Link href="/contact" className={styles.mobileLink} onClick={closeMenu}>{t('nav.contact')}</Link>
                            <Link href="/dashboard" className={styles.mobileLink} onClick={closeMenu}>{t('nav.dashboard')}</Link>
                            
                            <div className={styles.mobileAuthActions}>
                                {!user ? (
                                    <Link href="/login" className={styles.mobileLoginBtn} onClick={closeMenu}>{t('nav.login')}</Link>
                                ) : (
                                    <button className={styles.mobileLogoutBtn} onClick={async () => {
                                        await signOut({ redirect: false });
                                        closeMenu();
                                        router.push('/');
                                    }}>
                                        {t('nav.logout')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}
