import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { reviewSchema } from '@/lib/validators';
import { formatErrorResponse, UnauthorizedError, ValidationError } from '@/lib/errors';
import { getCurrentUser } from '@/lib/auth';
import { auditCreate } from '@/lib/audit';
import { checkRateLimit, reviewSubmitRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getCurrentUser();
        if (!user) {
            throw new UnauthorizedError();
        }

        // Rate limiting
        const rateLimitResult = await checkRateLimit(user.id, reviewSubmitRateLimit);
        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many review submissions. Please try again later.' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-RateLimit-Reset': rateLimitResult.reset.toString(),
                    },
                }
            );
        }

        // Parse and validate request body
        const body = await request.json();
        const validatedData = reviewSchema.parse(body);

        // Create review
        const review = await prisma.review.create({
            data: {
                companyId: validatedData.companyId,
                userId: user.id,
                roleType: validatedData.roleType,
                ratingsJson: validatedData.ratingsJson,
                redactedText: validatedData.redactedText,
                status: 'PENDING', // Reviews need approval
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
