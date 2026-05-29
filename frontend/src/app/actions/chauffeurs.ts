'use server';

import { prisma } from "@/lib/prisma";

export async function getChauffeurs() {
    try {
        const chauffeurs = await prisma.chauffeur.findMany({
            orderBy: { name: 'asc' },
        });
        return { success: true, data: chauffeurs };
    } catch (error) {
        console.error('Failed to fetch chauffeurs:', error);
        return { success: false, error: 'Failed to fetch chauffeurs' };
    }
}
