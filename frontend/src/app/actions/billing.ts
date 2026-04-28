'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBillStatus(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || (user.role !== 'ADMIN' && user.role !== 'EMPLOYEE')) {
        return { error: "Unauthorized" };
    }

    const billId = Number(formData.get("billId"));
    const status = formData.get("status") as string;

    if (!billId || !status) return { error: "Invalid data" };

    try {
        await prisma.bill.update({
            where: { id: billId },
            data: { status }
        });

        revalidatePath("/dashboard/billing");
        return { success: true };
    } catch (error) {
        console.error("Error updating bill status:", error);
        return { error: "Failed to update status" };
    }
}
