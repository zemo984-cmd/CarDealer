'use server';

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const safeUserSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    gender: true,
    address: true,
    occupation: true,
    profileImage: true,
    branchId: true,
    notificationsEnabled: true,
    colorBlindMode: true,
    dashboardColor: true,
    createdAt: true,
    updatedAt: true,
} as const;

export async function getCustomers() {
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'EMPLOYEE')) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const customers = await prisma.user.findMany({
            where: { role: 'CLIENT' },
            orderBy: { createdAt: 'desc' },
            select: {
                ...safeUserSelect,
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
    const session = await auth();
    const role = (session?.user as any)?.role;
    if (!session || (role !== 'ADMIN' && role !== 'EMPLOYEE')) {
        return { success: false, error: 'Unauthorized' };
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: { name: 'asc' },
            select: safeUserSelect,
        });
        return { success: true, data: users };
    } catch (error) {
        return { success: false, error: "Failed to fetch users" };
    }
}
