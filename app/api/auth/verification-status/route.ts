// Trigger IDE re-scan after prisma generate
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import prisma from '@/lib/db';

export async function GET() {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const fullUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: {
                emailVerified: true,
                onboardingStatus: true,
            },
        });

        if (!fullUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // If verified in DB but session says unverified, refresh the session
        if (fullUser.emailVerified && !user.emailVerified) {
            const { createSession } = await import('@/lib/auth-session');
            await createSession(
                user.id,
                true,
                fullUser.onboardingStatus,
                user.accountType
            );
        }

        return NextResponse.json({
            emailVerified: fullUser.emailVerified,
            onboardingStatus: fullUser.onboardingStatus,
        });
    } catch (error) {
        console.error('Verification status error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

