'use client';

import { Button } from "../Button/Button";
import styles from "./QuickActions.module.css";
import { Phone, Mail, MessageCircle } from "lucide-react";

export default function QuickActions() {
    return (
        <div className={styles.container}>
            <Button className={styles.actionBtn} onClick={() => window.location.href = 'tel:+123456789'}>
                <Phone size={20} />
                <span>Call</span>
            </Button>
            <Button className={`${styles.actionBtn} ${styles.whatsapp}`} onClick={() => window.open('https://wa.me/123456789', '_blank')}>
                <MessageCircle size={20} />
                <span>WhatsApp</span>
            </Button>
            <Button className={styles.actionBtn} variant="outline" onClick={() => window.location.href = 'mailto:info@automotive.com'}>
                <Mail size={20} />
                <span>Email</span>
            </Button>
        </div>
    );
}
