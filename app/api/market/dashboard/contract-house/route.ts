import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { calculateFairnessIndex, calculateConfidenceScore } from '@/lib/market-intelligence/scoring';
import { enforceKAnonymity, K_THRESHOLD } from '@/lib/market-intelligence/privacy';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const contractHouseId = searchParams.get('id');

    if (!contractHouseId) {
        return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    try {
        // 1. Fetch raw ratings for this Contract House
        // Ideally we fetch from a materialized view (CompanyReviewAggregate) but here we calculate on-the-fly for demo simplicity.
        const submissions = await (prisma as any).feedbackSubmission.findMany({
            where: {
                contractHouseId: contractHouseId,
                moderationStatus: 'APPROVED',
                verificationLevel: 'VERIFIED'
            },
            select: {
                ratingsJson: true,
                tags: true,
                createdAt: true,
                // verificationLevel is implicitly VERIFIED
            }
        });

        const sampleSize = submissions.length;

        // 2. Enforce K-Anonymity on count
        if (sampleSize < K_THRESHOLD) {
            return NextResponse.json({
                error: "Insufficient verified data. Orgs only see analytics when 5+ verified reviews exist.",
                requires: K_THRESHOLD,
                current: sampleSize
            }, { status: 403 }); // Or return empty state 200
        }

        // 3. Aggregate Scores
        let totalRatings: Record<string, number[]> = {};
        let allTags: string[] = [];

        submissions.forEach((sub: { ratingsJson: any, tags: string[] }) => {
            const ratings = sub.ratingsJson as Record<string, number>;
            if (ratings) {
                Object.keys(ratings).forEach(cat => {
                    if (!totalRatings[cat]) totalRatings[cat] = [];
                    totalRatings[cat].push(ratings[cat]);
                });
            }
            if (sub.tags) allTags.push(...sub.tags);
        });

        // Compute Averages
        const averages: Record<string, number> = {};
        Object.keys(totalRatings).forEach(cat => {
            const sum = totalRatings[cat].reduce((a, b) => a + b, 0);
            averages[cat] = sum / totalRatings[cat].length;
        });

        const fairnessIndex = calculateFairnessIndex(averages);

        // Compute Confidence
        // Simplification: variance=0.1
        const confidence = calculateConfidenceScore(sampleSize, submissions.filter((s: any) => s.createdAt > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)).length, 0.1);

        // Top Tags
        const tagCounts: Record<string, number> = {};
        allTags.forEach((t: string) => tagCounts[t] = (tagCounts[t] || 0) + 1);
        const topTags = Object.entries(tagCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([tag, count]) => ({ tag, count }));

        return NextResponse.json({
            meta: {
                isAnonymized: true,
                sampleSize
            },
            data: {
                fairnessIndex,
                categories: averages, // Radar chart data
                topTags,
                confidence
            }
        });

    } catch (error) {
        console.error("Dashboard error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
