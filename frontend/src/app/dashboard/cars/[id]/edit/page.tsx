import { prisma } from "@/lib/prisma";
import { EditCarForm } from "@/components/dashboard/EditCarForm";
import styles from "../../new/page.module.css";
import { notFound } from "next/navigation";

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const car = await prisma.car.findUnique({
        where: { id: Number(id) },
    });

    if (!car) {
        notFound();
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Edit Car: {car.make} {car.model}</h1>
            <EditCarForm car={car} />
        </div>
    );
}
