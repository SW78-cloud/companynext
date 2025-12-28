import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { searchQuerySchema } from '@/lib/validators';
import { formatErrorResponse, UnauthorizedError, ValidationError } from '@/lib/errors';
import { checkRateLimit, searchRateLimit } from '@/lib/rate-limit';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        // Enforce authentication
        const user = await getCurrentUser();
        if (!user) {
            throw new UnauthorizedError();
        }

        // Rate limiting
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const rateLimitResult = await checkRateLimit(ip, searchRateLimit);

        if (!rateLimitResult.success) {
            return NextResponse.json(
                { error: 'Too many requests' },
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

        // Parse and validate query parameters
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);
        const validatedParams = searchQuerySchema.parse(searchParams);

        // Search companies
        const companies = await prisma.company.findMany({
            where: {
                OR: [
                    { legalName: { contains: validatedParams.q, mode: 'insensitive' } },
                    { tradingNames: { has: validatedParams.q } },
                    { aliases: { has: validatedParams.q } },
                    { cipcNumber: { contains: validatedParams.q, mode: 'insensitive' } },
                ],
            },
            take: validatedParams.limit,
            skip: validatedParams.offset,
            select: {
                id: true,
                legalName: true,
                tradingNames: true,
                cipcNumber: true,
                industry: true,
                _count: {
                    select: {
                        caseRecords: true,
                        reviews: true,
                    },
                },
            },
        });

        return NextResponse.json(
            {
                companies,
                count: companies.length,
                query: validatedParams.q,
            },
            {
                headers: {
                    'X-RateLimit-Limit': rateLimitResult.limit.toString(),
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                },
            }
        );
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return NextResponse.json(
                formatErrorResponse(new ValidationError(error.message)),
                { status: 400 }
            );
        }

        return NextResponse.json(formatErrorResponse(error), { status: 500 });
    }
}
