'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './DashboardClientLayout.module.css';

interface DashboardClientLayoutProps {
    children: React.ReactNode;
    userName: string;
    role: string;
    profileImage?: string | null;
    dashboardColor?: string;
    unreadNotificationsCount?: number;
}

export default function DashboardClientLayout({
    children,
    userName,
    role,
    profileImage,
    dashboardColor,
    unreadNotificationsCount
}: DashboardClientLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className={styles.layout} style={{ '--dashboard-bg': dashboardColor || 'var(--background)' } as React.CSSProperties}>
            <div className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.open : ''}`}>
                <Sidebar role={role} />
            </div>
            
            {/* Overlay for mobile when sidebar is open */}
            {isSidebarOpen && (
                <div className={styles.overlay} onClick={closeSidebar} />
            )}

            <div className={styles.mainContent}>
                <Header 
                    userName={userName} 
                    role={role}
                    profileImage={profileImage}
                    onToggleSidebar={toggleSidebar}
                    unreadNotificationsCount={unreadNotificationsCount}
                />
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </div>
    );
}
