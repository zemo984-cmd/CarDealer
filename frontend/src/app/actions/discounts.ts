'use server';

import { prisma } from "@/lib/prisma";

export async function getDiscounts() {
    try {
        const discounts = await prisma.discount.findMany();
        const serializedDiscounts = discounts.map(d => ({
            ...d,
            amount: Number(d.amount)
        }));
        return { success: true, data: serializedDiscounts };
    } catch (error) {
        console.error('Failed to fetch discounts:', error);
        return { success: false, error: 'Failed to fetch discounts' };
    }
}
