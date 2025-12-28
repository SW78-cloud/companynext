import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { caseRecordsQuerySchema } from '@/lib/validators';
import { formatErrorResponse, NotFoundError, UnauthorizedError, ValidationError } from '@/lib/errors';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Enforce authentication
        const user = await getCurrentUser();
        if (!user) {
            throw new UnauthorizedError();
        }

        const { id } = await params;

        // Parse and validate query parameters
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        const validatedParams = caseRecordsQuerySchema.parse({
            id,
            ...searchParams,
        });

        // Check if company exists
        const company = await prisma.company.findUnique({
            where: { id: validatedParams.id },
            select: { id: true },
        });

        if (!company) {
            throw new NotFoundError('Company not found');
        }

        // Build where clause
        const where: any = { companyId: validatedParams.id };
        if (validatedParams.year) {
            where.year = validatedParams.year;
        }
        if (validatedParams.source) {
            where.source = validatedParams.source;
        }

        // Get case records
        const [cases, total] = await Promise.all([
            prisma.caseRecord.findMany({
                where,
                take: validatedParams.limit,
                skip: validatedParams.offset,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    caseRef: true,
                    source: true,
                    sourceUrl: true,
                    jurisdiction: true,
                    year: true,
                    partiesText: true,
                    topicTags: true,
                    outcomeLabel: true,
                    outcomeConfidence: true,
                    createdAt: true,
                },
            }),
            prisma.caseRecord.count({ where }),
        ]);

        return NextResponse.json({
            cases,
            pagination: {
                total,
                limit: validatedParams.limit,
                offset: validatedParams.offset,
                hasMore: validatedParams.offset + cases.length < total,
            },
        });
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
