import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { createSession } from '@/lib/auth-session';
import { logAudit } from '@/lib/audit';
import { jobSeekerRegisterSchema } from '@/lib/validators';
import { UserRole } from '@prisma/client';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = jobSeekerRegisterSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
        }

        const data = result.data;

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists with this email' }, { status: 409 });
        }

        const passwordHash = await hashPassword(data.password);

        // Determine Role
        const role = data.employmentType === 'PERMANENT' ? UserRole.EMPLOYEE : UserRole.CONTRACTOR;

        // Transaction to create User and IndividualProfile
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email: data.email,
                    passwordHash,
                    name: data.username, // Using provided username as display name
                    role: role,
                    accountType: 'INDIVIDUAL',
                    onboardingStatus: 'COMPLETE', // We collected all info
                    emailVerified: false,
                },
            });

            await tx.individualProfile.create({
                data: {
                    userId: newUser.id,
                    name: data.name,
                    surname: data.surname,
                    workerType: data.employmentType,
                    currentCompany: data.employmentType === 'PERMANENT' ? data.companyName : null,
                    contractHouse: data.employmentType === 'CONTRACTOR' ? data.contractHouse : null,
                    placedAtClient: data.employmentType === 'CONTRACTOR' ? data.placedAtClient : null,
                },
            });

            return newUser;
        });

        // Create Session
        await createSession(
            user.id,
            user.emailVerified,
            user.onboardingStatus,
            'INDIVIDUAL'
        );

        // Generate Verification Token (Self-contained for now, or reuse session logic)
        // For now, we'll use a simple approach or reuse the session encryption if exported, 
        // but to keep it simple and safe, let's assume valid verification flow is separate.
        // We will generate a mock token for the stub.
        const verificationToken = Buffer.from(JSON.stringify({ userId: user.id, email: user.email, type: 'verify' })).toString('base64');
        const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

        // Send Verification Email
        await sendVerificationEmail({
            to: user.email,
            verificationToken,
            verificationUrl
        });

        // Audit Logging
        await logAudit('USER_REGISTERED', 'User', user.id, undefined, {
            email: user.email,
            type: 'JOB_SEEKER',
            workerType: data.employmentType
        });
        await logAudit('EMAIL_VERIFICATION_SENT', 'User', user.id, undefined, { email: user.email });

        return NextResponse.json({ success: true, userId: user.id });

    } catch (error) {
        console.error('Job Seeker Registration error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
