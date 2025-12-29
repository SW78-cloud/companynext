/**
 * Vendor Onboarding API Endpoint
 * Handles profile creation and client relationship persistence.
 */
import { NextResponse } from 'next/server';

import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { createSession } from '@/lib/auth-session';
import prisma from '@/lib/db';
import { OnboardingStatus } from '@prisma/client';
import { logAudit } from '@/lib/audit';

const vendorSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    companyAddress: z.string().min(5, "Address must be at least 5 characters"),
    registrationNumber: z.string().min(5, "Registration number must be at least 5 characters"),
    businessEmail: z.string().email("Invalid business email"),
    clients: z.array(z.object({
        clientName: z.string().min(2, "Client name must be at least 2 characters"),
        staffCount: z.number().int().positive("Staff count must be a positive integer"),
    })).min(1, "At least one client is required"),
    clientsEarlyTerminationHabit: z.boolean(),
    earlyTerminationClients: z.array(z.string()).optional(),
}).refine((data) => {
    if (data.clientsEarlyTerminationHabit) {
        return !!data.earlyTerminationClients && data.earlyTerminationClients.length > 0;
    }
    return true;
}, {
    message: "At least one early termination client must be specified",
    path: ["earlyTerminationClients"],
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
        const result = vendorSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const data = result.data;

        // Transactional update
        const updatedUser = await prisma.$transaction(async (tx) => {
            // Upsert vendor profile
            const vendorProfile = await tx.vendorProfile.upsert({
                where: { userId: user.id },
                create: {
                    userId: user.id,
                    companyName: data.companyName,
                    companyAddress: data.companyAddress,
                    registrationNumber: data.registrationNumber,
                    businessEmail: data.businessEmail,
                    clientsEarlyTerminationHabit: data.clientsEarlyTerminationHabit,
                },
                update: {
                    companyName: data.companyName,
                    companyAddress: data.companyAddress,
                    registrationNumber: data.registrationNumber,
                    businessEmail: data.businessEmail,
                    clientsEarlyTerminationHabit: data.clientsEarlyTerminationHabit,
                },
            });

            // Replace vendor clients
            await tx.vendorClient.deleteMany({
                where: { vendorProfileId: vendorProfile.id },
            });

            await tx.vendorClient.createMany({
                data: data.clients.map((client) => ({
                    vendorProfileId: vendorProfile.id,
                    clientName: client.clientName,
                    staffCount: client.staffCount,
                    isEarlyTerminationClient: data.clientsEarlyTerminationHabit &&
                        data.earlyTerminationClients?.includes(client.clientName) || false,
                })),
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
        console.error('Vendor onboarding error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
