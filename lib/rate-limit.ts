import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create Redis client
const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiters for different endpoints
export const searchRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
    analytics: true,
    prefix: '@companynext/search',
});

export const apiRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
    analytics: true,
    prefix: '@companynext/api',
});

export const reviewSubmitRateLimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'), // 5 reviews per hour
    analytics: true,
    prefix: '@companynext/review',
});

export async function checkRateLimit(
    identifier: string,
    limiter: Ratelimit = apiRateLimit
): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    return {
        success,
        limit,
        remaining,
        reset,
    };
}
