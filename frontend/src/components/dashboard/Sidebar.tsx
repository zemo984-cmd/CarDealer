'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useTranslation } from '@/context/TranslationContext';
import {
    LayoutDashboard,
    Car,
    Users,
    ShoppingCart,
    Building2,
    Users2,
    Settings,
    Tag,
    TicketPercent,
    ReceiptText,
    LogOut
} from 'lucide-react';
import styles from './Sidebar.module.css';

const menuItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'CLIENT'] },
    { name: 'Cars', href: '/dashboard/cars', icon: Car, roles: ['ADMIN'] },
    { name: 'Customers', href: '/dashboard/customers', icon: Users, roles: ['ADMIN'] },
    { name: 'Chauffeurs', href: '/dashboard/chauffeurs', icon: Users2, roles: ['ADMIN'] },
    { name: 'Sales', href: '/dashboard/sales', icon: ShoppingCart, roles: ['ADMIN'] },
    { name: 'Billing', href: '/dashboard/billing', icon: ReceiptText, roles: ['ADMIN', 'CLIENT'] },
    { name: 'Branches', href: '/dashboard/branches', icon: Building2, roles: ['ADMIN'] },
    { name: 'Discounts', href: '/dashboard/discounts', icon: TicketPercent, roles: ['ADMIN'] },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['ADMIN', 'CLIENT'] },
];

import { useRouter } from 'next/navigation';

export default function Sidebar({ role }: { role: string }) {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useTranslation();

    const filteredItems = menuItems.filter(item => item.roles.includes(role));

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <span className={styles.logo}>{role === 'ADMIN' ? 'Admin User' : 'Customer User'}</span>
            </div>
            <nav className={styles.nav}>
                {filteredItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    // Lowercase the name to match translation keys (e.g., 'Overview' -> 'common.overview')
                    const translationKey = item.name.toLowerCase().replace(/ & /g, '').replace(/ /g, '');
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.item} ${isActive ? styles.active : ''}`}
                        >
                            <Icon size={20} />
                            <span>{t(`common.${translationKey}`)}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className={styles.footer}>
                <button
                    onClick={async () => {
                        await signOut({ redirect: false });
                        router.push('/');
                        router.refresh();
                    }}
                    className={styles.logoutBtn}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
}
