'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) {
        return { error: "Not authenticated" };
    }

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const occupation = formData.get("occupation") as string;

    try {
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                name,
                address,
                occupation
            }
        });
    } catch (error) {
        console.error("Settings update error:", error);
        return { error: "Failed to update settings" };
    }

    revalidatePath("/dashboard/settings");
    return { success: true };
}
