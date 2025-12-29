import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { sendVerificationEmail } from '@/lib/email';
import prisma from '@/lib/db';
import { randomBytes } from 'crypto';
import { logAudit } from '@/lib/audit';

// Rate limit: 3 emails per hour per user
const resendVerificationRateLimit = {
    limit: 3,
    windowSeconds: 3600,
    prefix: 'resend-verification',
};

export async function POST(request: Request) {
    try {
        // Check authentication
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if already verified
        if (user.emailVerified) {
            return NextResponse.json(
                { error: 'Email is already verified' },
                { status: 400 }
            );
        }

        // Check rate limit
        const rateLimitResult = await checkRateLimit(
            user.id,
            resendVerificationRateLimit
        );

        if (!rateLimitResult.success) {
            const resetDate = new Date(rateLimitResult.reset);
            const minutesUntilReset = Math.ceil(
                (resetDate.getTime() - Date.now()) / 60000
            );
            return NextResponse.json(
                {
                    error: `Too many requests. Please try again in ${minutesUntilReset} minute(s).`,
                    reset: rateLimitResult.reset,
                },
                { status: 429 }
            );
        }

        // Get user's email
        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { email: true },
        });

        if (!fullUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Generate verification token (in a real app, you'd store this in the database)
        // For now, we'll use a simple token that can be verified
        const verificationToken = randomBytes(32).toString('hex');
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${verificationToken}&userId=${user.id}`;

        // Send verification email
        try {
            if (process.env.NODE_ENV === 'development') {
                console.log('🔗 [DEV] Click here to verify email:', verificationUrl);
            }
            await sendVerificationEmail({
                to: fullUser.email,
                verificationToken,
                verificationUrl,
            });
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
            // In development, we still return success since it's just logging
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    { error: 'Failed to send verification email' },
                    { status: 500 }
                );
            }
        }

        await logAudit('EMAIL_VERIFICATION_SENT', 'User', user.id, undefined, { email: fullUser.email });

        return NextResponse.json({
            success: true,
            message: 'Verification email sent',
            remaining: rateLimitResult.remaining,
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

