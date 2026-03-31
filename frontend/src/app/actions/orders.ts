'use server';

import { prisma } from '@/lib/prisma';
import { order_status, order_type } from '@prisma/client';
import { revalidatePath } from "next/cache";

export async function getOrders() {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
                car: true
            } as any,
            orderBy: { createdAt: 'desc' },
        });

        const serializedOrders = (orders as any[]).map(order => ({
            ...order,
            totalAmount: Number(order.totalAmount),
            car: order.car ? {
                ...(order.car as any),
                price: Number((order.car as any).price)
            } : null
        }));

        return { success: true, data: serializedOrders };
    } catch (error) {
        return { success: false, error: "Failed to fetch orders" };
    }
}

export async function createOrder(data: {
    carId: number;
    userId: number;
    totalAmount: number;
    type: string;
    status?: string;
}) {
    try {
        const order = await prisma.order.create({
            data: {
                totalAmount: data.totalAmount,
                type: data.type as any,
                status: (data.status as any) || 'PENDING',
                userId: data.userId,
                carId: data.carId,
            }
        });

        if (data.type === 'PURCHASE') {
            await prisma.car.update({
                where: { id: data.carId },
                data: { status: 'SOLD' }
            });
        }

        revalidatePath('/dashboard/sales');
        revalidatePath('/dashboard/billing');

        return {
            success: true,
            data: {
                ...order,
                totalAmount: Number(order.totalAmount)
            }
        };
    } catch (error) {
        console.error("Failed to create order:", error);
        return { success: false, error: "Failed to create order" };
    }
}
