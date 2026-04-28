'use server';

import { createBooking } from "@/app/actions/bookings";
import { getCarById } from "@/app/actions/cars";
import { getChauffeurs } from "@/app/actions/chauffeurs";
import { redirect } from "next/navigation";
import BookingFormClient from "./BookingFormClient";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function NewBookingPage({
    searchParams,
}: {
    searchParams: Promise<{ carId?: string }>;
}) {
    const session = await auth();
    if (!session?.user?.email) {
        redirect('/login');
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        redirect('/login');
    }

    const { carId } = await searchParams;

    if (!carId) {
        redirect('/');
    }

    const carRes = await getCarById(Number(carId));
    const chauffeurRes = await getChauffeurs();

    if (!carRes.success || !carRes.data) {
        redirect('/');
    }

    // Fetch Tax Rate dynamically
    const taxSetting = await prisma.systemsetting.findUnique({
        where: { key: 'TAX_RATE' }
    });
    const taxRate = taxSetting ? Number(taxSetting.value) : 15; // default 15%

    return (
        <div>
            <h1 style={{ marginBottom: '2rem' }}>New Booking: {carRes.data.make} {carRes.data.model}</h1>
            <BookingFormClient
                car={carRes.data}
                chauffeurs={chauffeurRes.data || []}
                customerId={user.id}
                taxRate={taxRate}
            />
        </div>
    );
}
