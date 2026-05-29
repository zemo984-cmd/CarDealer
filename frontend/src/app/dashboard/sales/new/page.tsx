'use client';

import { createOrder } from "@/app/actions/orders";
import { Button } from "@/components/ui/Button/Button";
import styles from "../../cars/new/page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/context/TranslationContext";
import { getCars } from "@/app/actions/cars";
import { getUsers } from "@/app/actions/users";

export default function NewSalePage() {
    const router = useRouter();
    const { t } = useTranslation();
    const [cars, setCars] = useState<any[]>([]);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            getCars({ status: 'AVAILABLE' }),
            getUsers()
        ])
            .then(([carsRes, usersRes]) => {
                setCars(carsRes.data || []);
                setCustomers(usersRes.data?.filter((u: any) => u.role === 'CLIENT') || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    async function handleSubmit(formData: FormData) {
        const carId = Number(formData.get('carId'));
        const userId = Number(formData.get('userId'));
        const amount = Number(formData.get('amount'));
        const type = formData.get('type') as string;

        if (!carId || !userId || !amount) {
            alert('Please fill all required fields');
            return;
        }

        const result = await createOrder({
            carId,
            userId,
            totalAmount: amount,
            type: type,
            status: 'PENDING'
        });

        if (result.success) {
            router.push('/dashboard/sales');
            router.refresh();
        } else {
            alert('Failed to create order: ' + (result.error || 'Unknown error'));
        }
    }

    if (loading) return <div className={styles.container}>{t('common.loading')}</div>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Order</h1>

            <form action={handleSubmit} className={styles.form}>
                <div className={styles.grid}>
                    <div className={styles.group}>
                        <label>{t('common.customers') || 'Customer'}</label>
                        <select name="userId" required className={styles.select}>
                            <option value="">-- {t('common.select_customer') || 'Select Customer'} --</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.name || c.email}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.group}>
                        <label>{t('common.cars') || 'Car'}</label>
                        <select name="carId" required className={styles.select}>
                            <option value="">-- {t('common.select_car') || 'Select Car'} --</option>
                            {cars.map(c => (
                                <option key={c.id} value={c.id}>{c.make} {c.model} - ${Number(c.price).toLocaleString()}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.group}>
                        <label>{t('common.order_type') || 'Order Type'}</label>
                        <select name="type" className={styles.select} required>
                            <option value="PURCHASE">{t('common.purchase') || 'Purchase'}</option>
                            <option value="BOOKING">{t('common.booking') || 'Booking'}</option>
                            <option value="INSTALLMENT">{t('common.installment') || 'Installment'}</option>
                        </select>
                    </div>
                    <div className={styles.group}>
                        <label>{t('common.total_amount') || 'Total Amount'}</label>
                        <input name="amount" type="number" placeholder="0.00" required className={styles.input} />
                    </div>
                </div>

                <div className={styles.actions}>
                    <Button type="submit" size="lg">{t('common.create_order') || 'Create Order'}</Button>
                    <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>{t('common.cancel') || 'Cancel'}</Button>
                </div>
            </form>
        </div>
    );
}
