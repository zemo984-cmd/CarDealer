'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function requestPasswordReset(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return { error: 'Email is required' };
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        // Return success even if user not found to prevent enumeration
        return { success: true };
    }

    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
        where: { email },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry
        }
    });

    // In a real app, send email here.
    // console.log to server terminal for the user to click.
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log('------------------------------------------------');
    console.log('PASSWORD RESET LINK (For Development):');
    console.log(resetLink);
    console.log('------------------------------------------------');

    return { success: true };
}

export async function resetPassword(formData: FormData) {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!token || !password || !confirmPassword) {
        return { error: 'Invalid data' };
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' };
    }

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                gt: new Date()
            }
        }
    });

    if (!user) {
        return { error: 'Invalid or expired token' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });

    redirect('/login?reset=success');
}
