import prisma from '@/lib/db';

export const searchRateLimit = { limit: 20, windowSeconds: 60, prefix: 'search' };
export const apiRateLimit = { limit: 60, windowSeconds: 60, prefix: 'api' };
export const reviewSubmitRateLimit = { limit: 5, windowSeconds: 3600, prefix: 'review' };

export type RateLimitConfig = typeof apiRateLimit;

export async function checkRateLimit(
    identifier: string,
    config: RateLimitConfig = apiRateLimit
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const key = `${config.prefix}:${identifier}`;
    const now = new Date();

    try {
        const record = await prisma.rateLimit.findUnique({ where: { key } });

        if (record && record.resetAt > now) {
            if (record.count >= config.limit) {
                return {
                    success: false,
                    limit: config.limit,
                    remaining: 0,
                    reset: record.resetAt.getTime()
                };
            }

            const updated = await prisma.rateLimit.update({
                where: { key },
                data: { count: { increment: 1 } }
            });

            return {
                success: true,
                limit: config.limit,
                remaining: Math.max(0, config.limit - updated.count),
                reset: updated.resetAt.getTime()
            };
        }

        // Create or reset
        const resetAt = new Date(now.getTime() + config.windowSeconds * 1000);
        await prisma.rateLimit.upsert({
            where: { key },
            update: { count: 1, resetAt },
            create: { key, count: 1, resetAt }
        });

        return {
            success: true,
            limit: config.limit,
            remaining: config.limit - 1,
            reset: resetAt.getTime()
        };
    } catch (error) {
        // Fallback if DB is down or other error
        console.error('Rate limit error:', error);
        // Fail open to allow traffic if rate limiter breaks
        return {
            success: true,
            limit: config.limit,
            remaining: 1,
            reset: Date.now() + config.windowSeconds * 1000
        };
    }
}
