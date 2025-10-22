import { RateLimiterPrisma } from 'rate-limiter-flexible';

import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const FREE_TIER_LIMIT = 5;
const FREE_TIER_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
const GENERATION_COST = 1;

export async function getUsageTracker() {
    const usageTracker = new RateLimiterPrisma({
        storeClient: prisma,
        tableName: 'Usage',
        points: FREE_TIER_LIMIT, // Number of points
        duration: FREE_TIER_DURATION, // Per duration in seconds
    });

    return usageTracker;
};

export async function consumeCredits() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }

    const usageTracker = await getUsageTracker();
    const result = await usageTracker.consume(userId, GENERATION_COST); // consume 1 point
    return result;
};

export async function getUsageStatus() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error('Unauthorized');
    }
    const usageTracker = await getUsageTracker();
    const result = await usageTracker.get(userId);
    return result;
};



