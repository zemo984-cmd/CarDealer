import { createCar } from '@/app/actions/cars';
import { Button } from '@/components/ui/Button/Button';
import styles from './page.module.css';

export default function NewCarPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Add New Car</h1>

            <form action={createCar as any} className={styles.form}>
                <div className={styles.grid}>
                    <div className={styles.group}>
                        <label>Make</label>
                        <input name="make" placeholder="Toyota" required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Model</label>
                        <input name="model" placeholder="Camry" required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Year</label>
                        <input name="year" type="number" placeholder="2024" required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Price</label>
                        <input name="price" type="number" placeholder="25000" required className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Mileage (km)</label>
                        <input name="mileage" type="number" placeholder="0" className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Condition</label>
                        <select name="condition" className={styles.select}>
                            <option value="New">New</option>
                            <option value="Used">Used</option>
                        </select>
                    </div>
                    <div className={styles.group}>
                        <label>Image URL</label>
                        <input name="images" placeholder="https://example.com/car.jpg" className={styles.input} />
                    </div>
                    <div className={styles.group}>
                        <label>Status</label>
                        <select name="status" className={styles.select}>
                            <option value="AVAILABLE">Available</option>
                            <option value="SOLD">Sold</option>
                            <option value="RESERVED">Reserved</option>
                        </select>
                    </div>
                </div>
                <div className={styles.fullWidth}>
                    <label>Description</label>
                    <textarea name="description" rows={4} placeholder="Car details..." className={styles.textarea} />
                </div>

                <div className={styles.actions}>
                    <Button type="submit" size="lg">Save Car</Button>
                    <Button type="button" variant="ghost" size="lg">Cancel</Button>
                </div>
            </form>
        </div>
    );
}
