'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Helper for ActivityLog
async function logActivity(userId: number, action: string, details?: string) {
    try {
        await prisma.activitylog.create({
            data: { userId, action, details }
        });
    } catch (_) {}
}

export async function updateProfile(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const name = formData.get("name") as string;
    const address = formData.get("address") as string;
    const occupation = formData.get("occupation") as string;
    const profileImage = formData.get("profileImage") as string;

    try {
        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { name, address, occupation, profileImage }
        });
        await logActivity(user.id, "UPDATE_PROFILE", "Updated profile information");
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Profile update error:", error);
        return { error: "Failed to update profile" };
    }
}

export async function updateCustomerSettings(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const notificationsEnabled = formData.get("notificationsEnabled") === "true";
    const colorBlindMode = formData.get("colorBlindMode") === "true";
    const dashboardColor = formData.get("dashboardColor") as string;

    try {
        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { notificationsEnabled, colorBlindMode, dashboardColor }
        });
        await logActivity(user.id, "UPDATE_PREFERENCES", "Updated customer preferences");
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Preferences update error:", error);
        return { error: "Failed to update preferences" };
    }
}

export async function updateAdminSettings(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const role = (session.user as any).role;
    if (role !== "ADMIN") return { error: "Unauthorized" };

    const taxRate = formData.get("taxRate") as string;
    const primaryColor = formData.get("primaryColor") as string;

    try {
        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return { error: "User not found" };

        // Upsert TAX_RATE
        if (taxRate) {
            await prisma.systemsetting.upsert({
                where: { key: 'TAX_RATE' },
                update: { value: taxRate },
                create: { key: 'TAX_RATE', value: taxRate, description: 'Global Tax Rate (%)' }
            });
        }
        
        // Upsert SITE_COLOR
        if (primaryColor) {
            await prisma.systemsetting.upsert({
                where: { key: 'SITE_COLOR' },
                update: { value: primaryColor },
                create: { key: 'SITE_COLOR', value: primaryColor, description: 'Primary Site Color' }
            });
        }

        await logActivity(user.id, "UPDATE_SYSTEM_SETTINGS", "Updated global system settings");
        revalidatePath("/dashboard/settings");
        return { success: true };
    } catch (error) {
        console.error("Admin settings update error:", error);
        return { error: "Failed to update system settings" };
    }
}
