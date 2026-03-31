import { LucideIcon } from 'lucide-react';
import styles from './StatsCard.module.css';

interface StatsCardProps {
    title: string;
    value: string;
    icon: LucideIcon;
    trend?: string;
}

export default function StatsCard({ title, value, icon: Icon, trend }: StatsCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.title}>{title}</span>
                <Icon size={20} className={styles.icon} />
            </div>
            <div className={styles.content}>
                <span className={styles.value}>{value}</span>
                {trend && <span className={styles.trend}>{trend}</span>}
            </div>
        </div>
    );
}
