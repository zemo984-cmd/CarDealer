'use server';

import { createBooking } from "@/app/actions/bookings";
import { getCarById } from "@/app/actions/cars";
import { getChauffeurs } from "@/app/actions/chauffeurs";
import { Button } from "@/components/ui/Button/Button";
import { redirect } from "next/navigation";
import BookingFormClient from "./BookingFormClient";

export default async function NewBookingPage({
    searchParams,
}: {
    searchParams: Promise<{ carId?: string }>;
}) {
    const { carId } = await searchParams;

    if (!carId) {
        redirect('/');
    }

    const carRes = await getCarById(Number(carId));
    const chauffeurRes = await getChauffeurs();

    if (!carRes.success || !carRes.data) {
        redirect('/');
    }

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>New Booking: {carRes.data.make} {carRes.data.model}</h1>
            <BookingFormClient
                car={carRes.data}
                chauffeurs={chauffeurRes.data || []}
            />
        </div>
    );
}
