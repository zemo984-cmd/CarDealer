'use server';

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    const content = formData.get("content") as string;
    const receiverId = Number(formData.get("receiverId"));

    if (!content || !receiverId) {
        return { error: "Invalid data" };
    }

    try {
        const sender = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!sender) return { error: "User not found" };

        await prisma.message.create({
            data: {
                senderId: sender.id,
                receiverId,
                content
            }
        });

        // Fetch receiver to check if notifications are enabled
        const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
        if (receiver && receiver.notificationsEnabled) {
            await prisma.notification.create({
                data: {
                    userId: receiverId,
                    title: "رسالة جديدة",
                    message: `تلقيت رسالة جديدة من ${sender.name || sender.email}`
                }
            });
        }

        revalidatePath("/dashboard/messages");
        return { success: true };
    } catch (error) {
        console.error("Message send error:", error);
        return { error: "Failed to send message" };
    }
}
