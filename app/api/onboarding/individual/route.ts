/**
 * Individual Onboarding API Endpoint
 * Handles individual profile creation and worker type details.
 */
import { NextResponse } from 'next/server';

import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { createSession } from '@/lib/auth-session';
import prisma from '@/lib/db';
import { WorkerType, OnboardingStatus } from '@prisma/client';
import { logAudit } from '@/lib/audit';

const individualSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    workerType: z.nativeEnum(WorkerType),
    currentCompany: z.string().optional(),
    contractHouse: z.string().optional(),
    placedAtClient: z.string().optional(),
}).refine((data) => {
    if (data.workerType === WorkerType.PERMANENT) {
        return !!data.currentCompany;
    }
    if (data.workerType === WorkerType.CONTRACTOR) {
        return !!data.contractHouse && !!data.placedAtClient;
    }
    return true;
}, {
    message: "Missing required fields for the selected worker type",
    path: ["workerType"], // General path or specific ones based on logic
});

export async function POST(request: Request) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!user.emailVerified) {
            return NextResponse.json({ error: 'Email verification required' }, { status: 403 });
        }

        const body = await request.json();
        const result = individualSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const data = result.data;

        // Transaction to update profile and user status
        const updatedUser = await prisma.$transaction(async (tx) => {
            // Upsert individual profile
            await tx.individualProfile.upsert({
                where: { userId: user.id },
                create: {
                    userId: user.id,
                    name: data.name,
                    surname: data.surname,
                    workerType: data.workerType,
                    currentCompany: data.currentCompany,
                    contractHouse: data.contractHouse,
                    placedAtClient: data.placedAtClient,
                },
                update: {
                    name: data.name,
                    surname: data.surname,
                    workerType: data.workerType,
                    currentCompany: data.currentCompany,
                    contractHouse: data.contractHouse,
                    placedAtClient: data.placedAtClient,
                },
            });

            // Update user onboarding status
            return await tx.user.update({
                where: { id: user.id },
                data: {
                    onboardingStatus: OnboardingStatus.COMPLETE,
                },
            });
        });

        // Audit Logging
        await logAudit('ONBOARDING_COMPLETED', 'User', user.id,
            { onboardingStatus: user.onboardingStatus },
            { onboardingStatus: updatedUser.onboardingStatus }
        );

        // Update session cookie
        await createSession(
            updatedUser.id,
            updatedUser.emailVerified,
            updatedUser.onboardingStatus,
            updatedUser.accountType
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Individual onboarding error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
