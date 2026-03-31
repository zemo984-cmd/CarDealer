'use server';

import { signIn } from '@/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

export async function authenticate(formData: FormData) {
    try {
        const provider = formData.get('provider') as string;
        if (provider === 'google') {
            await signIn('google', { redirectTo: '/dashboard' });
        } else {
            const rememberMe = formData.get('rememberMe') === 'on';
            const result = await signIn('credentials', {
                ...Object.fromEntries(formData),
                redirectTo: '/dashboard',
                // Note: NextAuth v5 handles session based on config. 
                // We're passing it here so authorize() or callbacks can use it if needed.
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

export async function register(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Email and password are required' };
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: 'User already exists' };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'CLIENT'
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return { error: 'Failed to create account' };
    }

    redirect('/login?registered=true');
}
