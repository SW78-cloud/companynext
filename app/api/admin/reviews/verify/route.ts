import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getSessionUser } from '@/lib/auth'; // Pseudo-auth
import { z } from 'zod';
import { auditUpdate } from '@/lib/audit';

// Input Schema
const verifySchema = z.object({
    feedbackId: z.string().cuid(),
    method: z.enum(['PLACEMENT_MATCH', 'EVIDENCE', 'HANDSHAKE']),
    status: z.enum(['APPROVED', 'REJECTED']).default('APPROVED'),
});

export async function POST(request: Request) {
    try {
        const user = await getSessionUser();
        // RBAC: Must be Admin
        // if (user?.role !== 'ADMIN') return 403;

        const body = await request.json();
        const result = verifySchema.safeParse(body);
        if (!result.success) return NextResponse.json({ error: result.error.errors }, { status: 400 });

        const { feedbackId, method, status } = result.data;

        const updated = await prisma.feedbackSubmission.update({
            where: { id: feedbackId },
            data: {
                verificationLevel: 'VERIFIED',
                verificationMethod: method,
                moderationStatus: status,
                verifiedAt: new Date(),
                verifiedBy: user?.id || 'admin-sys',
            }
        });

        await auditUpdate(user?.id, 'FeedbackSubmission', feedbackId, { status: 'PENDING' }, { status: 'APPROVED', verification: 'VERIFIED' });

        return NextResponse.json({ success: true, updated });

    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
