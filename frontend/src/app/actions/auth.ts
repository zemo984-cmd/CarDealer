'use server';

import { signIn } from '@/auth';
import { prisma } from '@/lib/prisma';
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
        // silent
    }
}

// ============================================================
// AUTHENTICATE (Login)
// ============================================================
export async function authenticate(formData: FormData) {
    try {
        const provider = formData.get('provider') as string;
        if (provider === 'google') {
            await signIn('google', { redirectTo: '/dashboard' });
        } else {
            const result = await signIn('credentials', {
                ...Object.fromEntries(formData),
                redirectTo: '/dashboard',
            });
            return result;
        }
    } catch (error) {
        if ((error as any).type === 'CredentialsSignin') {
            return 'CredentialSignin';
        }
        throw error;
    }
}

// ============================================================
// REGISTER
// Validates password strength, creates user, logs activity
// ============================================================
export async function register(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    // ── Password Strength Validation ──
    if (password.length < 8) {
        return { error: 'Password must be at least 8 characters long' };
    }
    if (!/[A-Z]/.test(password)) {
        return { error: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { error: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { error: 'Password must contain at least one number' };
    }
    if (!/[@$!%*?&_#^]/.test(password)) {
        return { error: 'Password must contain at least one special character (@$!%*?&_#^)' };
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return { error: 'An account with this email already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'CLIENT',
            }
        });

        await logActivity(user.id, 'REGISTER', `New account registered: ${email}`);

    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Failed to create account. Please try again.' };
    }

    redirect('/login?registered=true');
}
