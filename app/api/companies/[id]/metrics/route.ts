import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { companyIdSchema } from '@/lib/validators';
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

        // Validate company ID
        const validatedParams = companyIdSchema.parse({ id });

        // Get company with aggregated metrics
        const company = await prisma.company.findUnique({
            where: { id: validatedParams.id },
            select: {
                id: true,
                legalName: true,
                cipcNumber: true,
                industry: true,
                _count: {
                    select: {
                        caseRecords: true,
                        reviews: { where: { status: 'PUBLISHED' } },
                    },
                },
            },
        });

        if (!company) {
            throw new NotFoundError('Company not found');
        }

        // Calculate additional metrics
        const casesByYear = await prisma.caseRecord.groupBy({
            by: ['year'],
            where: {
                companyId: validatedParams.id,
                year: { not: null },
            },
            _count: true,
            orderBy: { year: 'desc' },
        });

        const casesBySource = await prisma.caseRecord.groupBy({
            by: ['source'],
            where: { companyId: validatedParams.id },
            _count: true,
        });

        const casesByOutcome = await prisma.caseRecord.groupBy({
            by: ['outcomeLabel'],
            where: {
                companyId: validatedParams.id,
                outcomeLabel: { not: null },
            },
            _count: true,
        });

        const metrics = {
            totalCases: company._count.caseRecords,
            totalReviews: company._count.reviews,
            casesByYear: casesByYear.map((item) => ({
                year: item.year,
                count: item._count,
            })),
            casesBySource: casesBySource.map((item) => ({
                source: item.source,
                count: item._count,
            })),
            casesByOutcome: casesByOutcome.map((item) => ({
                outcome: item.outcomeLabel,
                count: item._count,
            })),
        };

        return NextResponse.json({
            company: {
                id: company.id,
                legalName: company.legalName,
                cipcNumber: company.cipcNumber,
                industry: company.industry,
            },
            metrics,
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
