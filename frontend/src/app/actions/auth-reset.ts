'use server';

import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

// ============================================================
// Helper: log activity to DB
// ============================================================
async function logActivity(userId: number | null, action: string, details?: string) {
    try {
        await prisma.activitylog.create({
            data: { userId, action, details }
        });
    } catch (_) {
        // silent – logging should never break main flow
    }
}

// ============================================================
// REQUEST PASSWORD RESET
// Generates a token valid for 10 minutes, max 2 uses
// Prints the link to the terminal for dev purposes
// ============================================================
export async function requestPasswordReset(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) {
        return { error: 'Email is required' };
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        // Don't reveal whether the email exists
        return { success: true };
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.user.update({
        where: { email },
        data: {
            resetToken: token,
            resetTokenExpiry: expiry,
            resetAttempts: 0, // reset counter on new request
        }
    });

    // Print to terminal for development
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log('\n================================================');
    console.log('🔑  PASSWORD RESET LINK  (Development Only)');
    console.log('================================================');
    console.log(`User  : ${user.name ?? user.email}`);
    console.log(`Link  : ${resetLink}`);
    console.log(`Expiry: 10 minutes from now`);
    console.log('================================================\n');

    await logActivity(user.id, 'FORGOT_PASSWORD_REQUEST', `Reset link generated for ${email}`);

    return { success: true };
}

// ============================================================
// VALIDATE TOKEN
// Returns user info if token is valid + checks attempt count
// ============================================================
export async function validateResetToken(token: string) {
    if (!token) return { error: 'Token is required' };

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() }
        }
    });

    if (!user) {
        return { error: 'الرابط منتهي الصلاحية أو غير صالح. يرجى طلب رابط جديد.' };
    }

    // Block after 2 uses
    if (user.resetAttempts >= 2) {
        // Invalidate the token
        await prisma.user.update({
            where: { id: user.id },
            data: { resetToken: null, resetTokenExpiry: null, resetAttempts: 0 }
        });
        return { error: 'تم تجاوز الحد الأقصى لاستخدام هذا الرابط (مرتان). يرجى طلب رابط جديد.' };
    }

    // Increment attempt counter
    await prisma.user.update({
        where: { id: user.id },
        data: { resetAttempts: { increment: 1 } }
    });

    return {
        valid: true,
        userId: user.id,
        email: user.email,
        attemptsLeft: 2 - (user.resetAttempts + 1),
    };
}

// ============================================================
// RESET PASSWORD
// Validates token, checks password strength, updates password
// ============================================================
export async function resetPassword(formData: FormData) {
    const token = formData.get('token') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!token || !password || !confirmPassword) {
        return { error: 'البيانات غير مكتملة' };
    }

    if (password !== confirmPassword) {
        return { error: 'كلمات المرور غير متطابقة' };
    }

    // Password strength validation
    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strongPassword.test(password)) {
        return {
            error: 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص'
        };
    }

    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() }
        }
    });

    if (!user) {
        return { error: 'الرابط منتهي الصلاحية أو غير صالح. يرجى طلب رابط جديد.' };
    }

    if (user.resetAttempts > 2) {
        return { error: 'تم تجاوز الحد الأقصى. يرجى طلب رابط جديد.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null,
            resetAttempts: 0,
        }
    });

    await logActivity(user.id, 'PASSWORD_RESET_SUCCESS', `Password changed via reset link`);

    redirect('/login?reset=success');
}
