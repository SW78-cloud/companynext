import { NextResponse } from 'next/server';

import { getSessionUser } from '@/lib/auth';
import { createSession } from '@/lib/auth-session';
import prisma from '@/lib/db';
import { AccountType, OnboardingStatus } from '@prisma/client';
import { logAudit } from '@/lib/audit';

export async function POST(request: Request) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { accountType } = body;

        if (!accountType || !Object.values(AccountType).includes(accountType as AccountType)) {
            return NextResponse.json({ error: 'Invalid account type' }, { status: 400 });
        }

        // Update user in database
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                accountType: accountType as AccountType,
                onboardingStatus: OnboardingStatus.IN_PROGRESS,
            },
        });

        // Audit Logging
        await logAudit('ONBOARDING_STARTED', 'User', user.id,
            { onboardingStatus: user.onboardingStatus, accountType: user.accountType },
            { onboardingStatus: updatedUser.onboardingStatus, accountType: updatedUser.accountType }
        );

        // Update session cookie with new info
        await createSession(
            updatedUser.id,
            updatedUser.emailVerified,
            updatedUser.onboardingStatus,
            updatedUser.accountType
        );

        return NextResponse.json({
            success: true,
            onboardingStatus: updatedUser.onboardingStatus,
            accountType: updatedUser.accountType,
        });
    } catch (error) {
        console.error('Set account type error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
