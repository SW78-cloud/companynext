import prisma from './db';

const GLASSDOOR_PARTNER_ID = process.env.GLASSDOOR_PARTNER_ID;
const GLASSDOOR_PARTNER_KEY = process.env.GLASSDOOR_PARTNER_KEY;
const GLASSDOOR_API_BASE = process.env.GLASSDOOR_API_BASE || 'https://api.glassdoor.com/api/api.htm';
const REVIEW_CACHE_TTL_HOURS = parseInt(process.env.REVIEW_CACHE_TTL_HOURS || '24', 10);

export interface GlassdoorRatings {
    overallRating: number;
    ratingDescription: string;
    numberOfRatings: number;
    cultureAndValuesRating: number;
    seniorLeadershipRating: number;
    compensationAndBenefitsRating: number;
    careerOpportunitiesRating: number;
    workLifeBalanceRating: number;
    featuredReview?: {
        id: number;
        reviewDateTime: string;
        headline: string;
        pros: string;
        cons: string;
        jobTitle: string;
        location: string;
        currentJob: boolean;
    };
}

export async function getGlassdoorRatings(
    companyId: string,
    companyName: string,
    userIp: string,
    userAgent: string
): Promise<GlassdoorRatings | null> {
    // 1. Check cache
    const cache = await prisma.glassdoorCache.findUnique({
        where: { companyId },
    });

    if (cache && cache.expiresAt > new Date()) {
        return cache.data as unknown as GlassdoorRatings;
    }

    // 2. Fetch from Glassdoor
    if (!GLASSDOOR_PARTNER_ID || !GLASSDOOR_PARTNER_KEY) {
        console.warn('Glassdoor API credentials not configured');
        return null;
    }

    try {
        const params = new URLSearchParams({
            't.p': GLASSDOOR_PARTNER_ID,
            't.k': GLASSDOOR_PARTNER_KEY,
            userip: userIp,
            useragent: userAgent,
            format: 'json',
            v: '1',
            action: 'employers',
            q: companyName,
        });

        const response = await fetch(`${GLASSDOOR_API_BASE}?${params.toString()}`);
        if (!response.ok) {
            throw new Error(`Glassdoor API responded with ${response.status}`);
        }

        const json = await response.json();

        // Find best match (exact name match or first result)
        const employers = json.response?.employers || [];
        const match = employers.find((e: any) => e.name.toLowerCase() === companyName.toLowerCase()) || employers[0];

        if (!match) {
            return null;
        }

        const ratings: GlassdoorRatings = {
            overallRating: match.overallRating,
            ratingDescription: match.ratingDescription,
            numberOfRatings: match.numberOfRatings,
            cultureAndValuesRating: parseFloat(match.cultureAndValuesRating || '0'),
            seniorLeadershipRating: parseFloat(match.seniorLeadershipRating || '0'),
            compensationAndBenefitsRating: parseFloat(match.compensationAndBenefitsRating || '0'),
            careerOpportunitiesRating: parseFloat(match.careerOpportunitiesRating || '0'),
            workLifeBalanceRating: parseFloat(match.workLifeBalanceRating || '0'),
            featuredReview: match.featuredReview ? {
                id: match.featuredReview.id,
                reviewDateTime: match.featuredReview.reviewDateTime,
                headline: match.featuredReview.headline,
                pros: match.featuredReview.pros,
                cons: match.featuredReview.cons,
                jobTitle: match.featuredReview.jobTitle,
                location: match.featuredReview.location,
                currentJob: match.featuredReview.currentJob,
            } : undefined,
        };

        // 3. Update cache
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + REVIEW_CACHE_TTL_HOURS);

        await prisma.glassdoorCache.upsert({
            where: { companyId },
            create: {
                companyId,
                data: ratings as any,
                expiresAt,
            },
            update: {
                data: ratings as any,
                expiresAt,
            },
        });

        return ratings;
    } catch (error) {
        console.error('Error fetching Glassdoor ratings:', error);
        return null;
    }
}
