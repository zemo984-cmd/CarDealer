'use server';

import { prisma } from "@/lib/prisma";


export async function getBranches() {
    try {
        const branches = await prisma.branch.findMany({
            include: { _count: { select: { user: true } } }
        });
        return { success: true, data: branches };
    } catch (error) {
        console.error('Failed to fetch branches:', error);
        return { success: false, error: 'Failed to fetch branches' };
    }
}

export async function getEmployees() {
    try {
        const employees = await prisma.user.findMany({
            where: {
                role: { in: ['ADMIN', 'EMPLOYEE'] }
            },
            include: { branch: true },
            orderBy: { createdAt: 'desc' }
        });
        return { success: true, data: employees };
    } catch (error) {
        console.error('Failed to fetch employees:', error);
        return { success: false, error: 'Failed to fetch employees' };
    }
}
