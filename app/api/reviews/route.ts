import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { reviewSchema } from '@/lib/validators';
import { formatErrorResponse, UnauthorizedError, ValidationError } from '@/lib/errors';
import { getCurrentUser } from '@/lib/auth';
import { auditCreate } from '@/lib/audit';
import { checkRateLimit, reviewSubmitRateLimit } from '@/lib/rate-limit';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            throw new UnauthorizedError();
        }

        // Goal 3: Only registered permanent employees or contractors can submit reviews.
        const ELIGIBLE_ROLES = ['EMPLOYEE', 'CONTRACTOR', 'ADMIN'];
        if (!ELIGIBLE_ROLES.includes(user.role)) {
            return NextResponse.json(
                { error: 'Only permanent employees and contractors can submit reviews.' },
                { status: 403 }
            );
        }

        // Anti-abuse: 1 review per user per company per 90 days
        // We'll parse the body first to get the companyId
        const body = await request.json();
        const validatedData = reviewSchema.parse(body);

        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        const existingReview = await prisma.review.findFirst({
            where: {
                userId: user.id,
                companyId: validatedData.companyId,
                createdAt: { gte: ninetyDaysAgo },
            },
        });

        if (existingReview) {
            return NextResponse.json(
                { error: 'You can only submit one review per company every 90 days.' },
                { status: 429 }
            );
        }

        // Rate limiting (generic)
        const rateLimitResult = await checkRateLimit(user.id, reviewSubmitRateLimit);

        // Generate abuse signals (hashed IP)
        const forwarded = request.headers.get('x-forwarded-for');
        const userIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
        const ipHash = crypto.createHash('sha256').update(userIp).digest('hex');

        // Create review
        const review = await prisma.review.create({
            data: {
                companyId: validatedData.companyId,
                userId: user.id,
                employmentType: validatedData.employmentType,
                isAnonymous: validatedData.isAnonymous,
                title: validatedData.title,
                body: validatedData.body,
                ratingsJson: validatedData.ratingsJson as any,
                city: validatedData.city,
                province: validatedData.province,
                dates: validatedData.dates as any,
                status: 'PENDING',
                abuseSignals: {
                    ipHash,
                    userAgent: request.headers.get('user-agent'),
                } as any,
                // Legacy fields
                roleType: validatedData.roleType || validatedData.employmentType,
                redactedText: validatedData.redactedText || validatedData.body,
            },
        });

        // Audit log
        await auditCreate(user.id, 'Review', review.id, review);

        return NextResponse.json(
            {
                review: {
                    id: review.id,
                    status: review.status,
                    createdAt: review.createdAt,
                },
                message: 'Review submitted successfully and is pending approval',
            },
            { status: 201 }
        );
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json(
                formatErrorResponse(new ValidationError(error.message)),
                { status: 400 }
            );
        }

        const formatted = formatErrorResponse(error);
        return NextResponse.json(formatted, {
            status: formatted.error.statusCode || 500,
        });
    }
}
