import { NextRequest, NextResponse } from 'next/server';
import { getGlassdoorRatings } from '@/lib/glassdoor';
import { getCurrentUser } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/errors';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        // 1. Check authentication
        const user = await getCurrentUser();
        if (!user) {
            throw new UnauthorizedError();
        }

        const searchParams = request.nextUrl.searchParams;
        const companyId = searchParams.get('companyId');

        if (!companyId) {
            return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
        }

        // 2. Resolve company name if not provided
        let companyName = searchParams.get('companyName');
        if (!companyName) {
            const company = await prisma.company.findUnique({
                where: { id: companyId },
                select: { legalName: true },
            });
            if (!company) {
                return NextResponse.json({ error: 'Company not found' }, { status: 404 });
            }
            companyName = company.legalName;
        }

        // 3. Get IP and User-Agent
        const forwarded = request.headers.get('x-forwarded-for');
        const userIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';
        const userAgent = request.headers.get('user-agent') || 'node-fetch';

        // 4. Fetch/Cache
        const ratings = await getGlassdoorRatings(companyId, companyName, userIp, userAgent);

        if (!ratings) {
            return NextResponse.json({ error: 'Ratings not found' }, { status: 404 });
        }

        return NextResponse.json(ratings);
    } catch (error: any) {
        console.error('Glassdoor API Route Error:', error);
        if (error instanceof UnauthorizedError) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
