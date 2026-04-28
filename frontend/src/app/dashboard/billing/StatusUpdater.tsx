'use client';

import { useState } from 'react';
import { updateBillStatus } from '@/app/actions/billing';
import styles from '../../cars/page.module.css';

export default function StatusUpdater({ billId, currentStatus }: { billId: number, currentStatus: string }) {
    const [status, setStatus] = useState(currentStatus);
    const [loading, setLoading] = useState(false);

    const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        setLoading(true);

        const formData = new FormData();
        formData.append('billId', billId.toString());
        formData.append('status', newStatus);

        const result = await updateBillStatus(formData);
        if (result?.error) {
            alert(result.error);
            setStatus(currentStatus); // Revert
        }
        setLoading(false);
    };

    return (
        <select 
            value={status} 
            onChange={handleChange} 
            disabled={loading}
            className={`${styles.badge} ${status === 'Paid' ? styles.available : styles.booked}`}
            style={{ appearance: 'auto', paddingRight: '20px', cursor: 'pointer', border: 'none' }}
        >
            <option value="Unpaid">غير مدفوعة (Unpaid)</option>
            <option value="Paid">مدفوعة (Paid)</option>
            <option value="Cancelled">ملغاة (Cancelled)</option>
            <option value="Refunded">مسترجعة (Refunded)</option>
        </select>
    );
}
