'use server';

import { prisma } from '@/lib/prisma';
import { booking_status } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function createBooking(data: {
    customerId: number;
    carId: number;
    driveOption: string;
    meterReading: number;
    amount: number;
    securityDeposit: number;
    discountId?: number;
    chauffeurId?: number;
}) {
    try {
        const booking = await prisma.booking.create({
            data: {
                customerId: data.customerId,
                carId: data.carId,
                driveOption: data.driveOption,
                meterReading: data.meterReading,
                status: 'PENDING',
                amount: data.amount,
                securityDeposit: data.securityDeposit,
                discountId: data.discountId,
                chauffeurId: data.chauffeurId,
            },
        });

        // Update car status to BOOKED
        await prisma.car.update({
            where: { id: data.carId },
            data: { status: 'BOOKED' }
        });

        // Automatically generate a bill
        await createBill({
            bookingId: booking.id,
            totalAmount: data.amount,
            discountAmount: 0, // Should be calculated if discountId exists
            taxAmount: Number(data.amount) * 0.15, // Example 15% tax
            advanceAmount: 0,
            balanceAmount: Number(data.amount) * 1.15,
        });

        revalidatePath('/dashboard/bookings');
        return { success: true, data: booking };
    } catch (error) {
        console.error('Error creating booking:', error);
        return { success: false, error: 'Failed to create booking' };
    }
}

export async function getBookings() {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: true,
                car: true,
                chauffeur: true,
                bill: true,
            },
            orderBy: { bookingDate: 'desc' },
        });

        const serializedBookings = bookings.map(booking => ({
            ...booking,
            amount: Number(booking.amount),
            securityDeposit: Number(booking.securityDeposit),
            bill: booking.bill ? {
                ...booking.bill,
                totalAmount: Number(booking.bill.totalAmount),
                discountAmount: Number(booking.bill.discountAmount),
                taxAmount: Number(booking.bill.taxAmount),
                advanceAmount: Number(booking.bill.advanceAmount),
                balanceAmount: Number(booking.bill.balanceAmount),
            } : null
        }));

        return { success: true, data: serializedBookings };
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return { success: false, error: 'Failed to fetch bookings' };
    }
}

async function createBill(data: {
    bookingId: number;
    totalAmount: number;
    discountAmount: number;
    taxAmount: number;
    advanceAmount: number;
    balanceAmount: number;
}) {
    return await prisma.bill.create({
        data: {
            bookingId: data.bookingId,
            totalAmount: data.totalAmount,
            discountAmount: data.discountAmount,
            taxAmount: data.taxAmount,
            advanceAmount: data.advanceAmount,
            balanceAmount: data.balanceAmount,
            status: 'Unpaid',
        },
    });
}
