import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { createSession } from '@/lib/auth-session';
import { logAudit } from '@/lib/audit';
import { sendVerificationEmail } from '@/lib/email';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const { email, password, name } = result.data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
        }

        const passwordHash = await hashPassword(password);

        // We can assume role is VISITOR by default
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true
            }
        });

        await createSession(
            user.id,
            false, // emailVerified initial
            'NOT_STARTED', // onboardingStatus initial
            null // accountType initial
        );

        // Generate simple verification token (in production use a real token store)
        const verificationToken = Buffer.from(`${user.email}:${Date.now()}`).toString('base64');
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        // Send Email (or log in dev)
        await sendVerificationEmail({
            to: user.email,
            verificationToken,
            verificationUrl
        });

        // Audit Logging
        await logAudit('USER_REGISTERED', 'User', user.id, undefined, { email: user.email, name: user.name });
        await logAudit('EMAIL_VERIFICATION_SENT', 'User', user.id, undefined, { email: user.email });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
