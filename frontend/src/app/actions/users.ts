'use server';

import { prisma } from "@/lib/prisma";

export async function getCustomers() {
    try {
        const customers = await prisma.user.findMany({
            where: { role: 'CLIENT' },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: {
                        order: true,
                        booking: true
                    }
                }
            }
        });
        return { success: true, data: customers };
    } catch (error) {
        console.error('Failed to fetch customers:', error);
        return { success: false, error: 'Failed to fetch customers' };
    }
}

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' }
        });
        return { success: true, data: users };
    } catch (error) {
        return { success: false, error: "Failed to fetch users" };
    }
}
