'use client';

import { useState, useTransition } from "react";
import { updateCar } from "@/app/actions/cars";
import { Button } from "@/components/ui/Button/Button";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import styles from "../../app/dashboard/cars/new/page.module.css";
import { useRouter } from "next/navigation";

export function EditCarForm({ car }: { car: any }) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setStatus('idle');
        startTransition(async () => {
            const result = await updateCar(car.id, formData);
            if (result.success) {
                setStatus('success');
                setTimeout(() => router.push('/dashboard/cars'), 2000);
            } else {
                setStatus('error');
                setErrorMessage(result.error || "Failed to update car");
            }
        });
    }

    return (
        <form action={handleSubmit} className={styles.form}>
            {status === 'success' && (
                <div style={{ backgroundColor: '#ecfdf5', color: '#065f46', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={20} />
                    Car updated successfully! Redirecting...
                </div>
            )}

            {status === 'error' && (
                <div style={{ backgroundColor: '#fef2f2', color: '#991b1b', padding: '16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={20} />
                    {errorMessage}
                </div>
            )}

            <div className={styles.grid}>
                <div className={styles.group}>
                    <label>Make</label>
                    <input name="make" defaultValue={car.make} required className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>Model</label>
                    <input name="model" defaultValue={car.model} required className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>Year</label>
                    <input name="year" type="number" defaultValue={car.year} required className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>Price</label>
                    <input name="price" type="number" defaultValue={Number(car.price)} required className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>Mileage (km)</label>
                    <input name="mileage" type="number" defaultValue={car.mileage || 0} className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>Condition</label>
                    <select name="condition" defaultValue={car.condition} className={styles.select}>
                        <option value="New">New</option>
                        <option value="Used">Used</option>
                    </select>
                </div>
                <div className={styles.group}>
                    <label>Image URL</label>
                    <input name="images" defaultValue={car.images || ''} className={styles.input} />
                </div>
                <div className={styles.group}>
                    <label>Status</label>
                    <select name="status" defaultValue={car.status} className={styles.select}>
                        <option value="AVAILABLE">Available</option>
                        <option value="SOLD">Sold</option>
                        <option value="RESERVED">Reserved</option>
                        <option value="MAINTENANCE">Maintenance</option>
                    </select>
                </div>
            </div>

            <div className={styles.fullWidth}>
                <label>Description</label>
                <textarea name="description" rows={4} defaultValue={car.description || ''} className={styles.textarea} />
            </div>

            <div className={styles.actions}>
                <Button type="submit" size="lg" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 size={18} className="animate-spin" style={{ marginRight: '8px' }} />
                            Updating...
                        </>
                    ) : 'Update Car'}
                </Button>
                <Button type="button" variant="ghost" size="lg" onClick={() => router.push('/dashboard/cars')} disabled={isPending}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
