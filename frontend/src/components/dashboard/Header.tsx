'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, LogOut, ChevronDown, Menu } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useTranslation } from '@/context/TranslationContext';
import { LanguageSwitcher } from '../ui/LanguageSwitcher/LanguageSwitcher';
import { Moon, Sun } from 'lucide-react';
import styles from './Header.module.css';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    userName?: string;
    role?: string;
    profileImage?: string | null;
    onToggleSidebar?: () => void;
    unreadNotificationsCount?: number;
}

export default function Header({ userName, role, profileImage, onToggleSidebar, unreadNotificationsCount = 0 }: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const { t } = useTranslation();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/login');
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button className={styles.menuBtn} onClick={onToggleSidebar}>
                    <Menu size={24} />
                </button>
                <div className={styles.search}>
                    {/* Placeholder for search if needed */}
                </div>
            </div>
            
            <div className={styles.actions}>
                <div className={styles.themeLanguage}>
                    <LanguageSwitcher />
                    <button className={styles.iconBtn} onClick={toggleTheme}>
                        {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                    </button>
                </div>
                
                <button className={styles.iconBtn} title="Notifications" style={{ position: 'relative' }}>
                    <Bell size={20} />
                    {unreadNotificationsCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-2px',
                            right: '-2px',
                            background: '#ef4444',
                            color: 'white',
                            fontSize: '10px',
                            fontWeight: 'bold',
                            borderRadius: '50%',
                            minWidth: '16px',
                            height: '16px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '0 4px'
                        }}>
                            {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
                        </span>
                    )}
                </button>
                
                <div className={styles.userContainer} ref={dropdownRef}>
                    <button 
                        className={styles.user} 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen}
                    >
                        <div className={styles.avatar}>
                            {profileImage ? (
                                <img src={profileImage} alt={userName || 'User'} className={styles.avatarImg} />
                            ) : (
                                <User size={20} />
                            )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '0.5rem', marginRight: '0.5rem' }}>
                            <span className={styles.userName}>{userName}</span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                                {role === 'ADMIN' ? 'Admin' : role === 'EMPLOYEE' ? 'Employee' : 'Customer'}
                            </span>
                        </div>
                        <ChevronDown size={14} style={{ color: '#94a3b8' }} />
                    </button>

                    {dropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            <div className={styles.dropdownHeader}>
                                <div className={styles.avatar}>
                                    {profileImage ? (
                                        <img src={profileImage} alt={userName || 'User'} className={styles.avatarImg} />
                                    ) : (
                                        <User size={20} />
                                    )}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <strong>{userName}</strong>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{role}</span>
                                </div>
                            </div>
                            <div className={styles.dropdownDivider} />
                            <button 
                                className={styles.dropdownItem} 
                                onClick={handleLogout}
                                style={{ color: '#ff0000' }} // Red colored logout as requested
                            >
                                <LogOut size={16} />
                                تسجيل الخروج
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
