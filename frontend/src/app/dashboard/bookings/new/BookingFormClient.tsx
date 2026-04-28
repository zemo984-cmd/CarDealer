'use client';

import React, { useState } from 'react';
import { createBooking } from "@/app/actions/bookings";
import { Button } from "@/components/ui/Button/Button";
import styles from './BookingForm.module.css';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
    car: any;
    chauffeurs: any[];
    customerId: number;
    taxRate: number;
}

const BookingFormClient: React.FC<BookingFormProps> = ({ car, chauffeurs, customerId, taxRate }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        driveOption: 'Self-Drive',
        chauffeurId: '',
        meterReading: car.meterReading || 0,
    });

    const baseAmount = Number(car.price);
    const tax = baseAmount * (taxRate / 100);
    const totalAmount = baseAmount + tax;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const result = await createBooking({
            customerId,
            carId: car.id,
            driveOption: formData.driveOption,
            meterReading: Number(formData.meterReading),
            amount: baseAmount,
            securityDeposit: 500, // Placeholder
            chauffeurId: formData.chauffeurId ? Number(formData.chauffeurId) : undefined,
            // Pass standard tax calculation elements to the backend action if needed, or backend recalculates them
        });

        if (result.success) {
            router.push('/dashboard/billing'); 
        } else {
            alert(result.error);
        }
        setLoading(false);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.section}>
                <h3>Rental Options</h3>
                <div className={styles.field}>
                    <label>Drive Option</label>
                    <select
                        value={formData.driveOption}
                        onChange={(e) => setFormData({ ...formData, driveOption: e.target.value })}
                    >
                        <option value="Self-Drive">Self-Drive</option>
                        <option value="Chauffeur">Chauffeur</option>
                    </select>
                </div>

                {formData.driveOption === 'Chauffeur' && (
                    <div className={styles.field}>
                        <label>Select Chauffeur</label>
                        <select
                            value={formData.chauffeurId}
                            onChange={(e) => setFormData({ ...formData, chauffeurId: e.target.value })}
                            required
                        >
                            <option value="">Choose a chauffeur...</option>
                            {chauffeurs.map((c) => (
                                <option key={c.id} value={c.id}>{c.name} - {c.status}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className={styles.field}>
                    <label>Current Meter Reading (km)</label>
                    <input
                        type="number"
                        value={formData.meterReading}
                        onChange={(e) => setFormData({ ...formData, meterReading: Number(e.target.value) })}
                        required
                    />
                </div>
            </div>

            <div className={styles.summary}>
                <h3>Summary</h3>
                <div className={styles.row}>
                    <span>Base Amount:</span>
                    <span>${baseAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className={styles.row}>
                    <span>Tax ({taxRate}%):</span>
                    <span>${tax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className={styles.total}>
                    <span>Total:</span>
                    <span>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
            </div>

            <Button type="submit" disabled={loading} fullWidth>
                {loading ? 'Processing...' : 'Confirm Booking'}
            </Button>
        </form>
    );
};

export default BookingFormClient;
