import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getSessionUser } from '@/lib/auth';
import { createSession } from '@/lib/auth-session';
import prisma from '@/lib/db';
import { OnboardingStatus, CompanySector } from '@prisma/client';
import { logAudit } from '@/lib/audit';

const companySchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    companyAddress: z.string().min(5, "Address must be at least 5 characters"),
    registrationNumber: z.string().min(5, "Registration number must be at least 5 characters"),
    sector: z.nativeEnum(CompanySector),
    numberOfEmployees: z.number().int().positive("Employee count must be a positive integer"),
    businessEmail: z.string().email("Invalid business email"),
    vendorList: z.array(z.object({
        vendorName: z.string().min(2, "Vendor name must be at least 2 characters"),
        staffCount: z.number().int().positive("Staff count must be a positive integer"),
    })).min(1, "At least one vendor is required"),
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
        const result = companySchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const data = result.data;

        // Transactional update
        const updatedUser = await prisma.$transaction(async (tx) => {
            // Upsert company profile
            const companyProfile = await tx.companyProfile.upsert({
                where: { userId: user.id },
                create: {
                    userId: user.id,
                    companyName: data.companyName,
                    companyAddress: data.companyAddress,
                    registrationNumber: data.registrationNumber,
                    sector: data.sector,
                    numberOfEmployees: data.numberOfEmployees,
                    businessEmail: data.businessEmail,
                },
                update: {
                    companyName: data.companyName,
                    companyAddress: data.companyAddress,
                    registrationNumber: data.registrationNumber,
                    sector: data.sector,
                    numberOfEmployees: data.numberOfEmployees,
                    businessEmail: data.businessEmail,
                },
            });

            // Replace company vendors
            await tx.companyVendor.deleteMany({
                where: { companyProfileId: companyProfile.id },
            });

            await tx.companyVendor.createMany({
                data: data.vendorList.map((vendor) => ({
                    companyProfileId: companyProfile.id,
                    vendorName: vendor.vendorName,
                    staffCount: vendor.staffCount,
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
        console.error('Company onboarding error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

