// Trigger IDE re-scan after prisma generate
import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { createSession } from '@/lib/auth-session';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = loginSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: "Invalid email or password format" }, { status: 400 });
        }

        const { email, password } = result.data;

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                passwordHash: true,
                role: true,
                emailVerified: true,
                onboardingStatus: true,
                accountType: true,
            }
        });

        if (!user) {
            // Use generic error message for security
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        await createSession(
            user.id,
            user.emailVerified,
            user.onboardingStatus,
            user.accountType
        );

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                emailVerified: user.emailVerified,
                onboardingStatus: user.onboardingStatus,
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
