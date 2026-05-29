import { getCarById } from "@/app/actions/cars";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import CarDetailClient from "./CarDetailClient";

export const dynamic = 'force-dynamic';

export default async function CarDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await auth();
    const { data: car, error } = await getCarById(Number(id));

    if (error || !car) {
        notFound();
    }

    return <CarDetailClient car={car} hasSession={!!session} />;
}
