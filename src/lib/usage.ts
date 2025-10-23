import { RateLimiterPrisma } from 'rate-limiter-flexible';

import { prisma } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';

const FREE_TIER_LIMIT = 2;
const FREE_TIER_DURATION = 24 * 60 * 60; // 24 hours in seconds
const GENERATION_COST = 0.4;
const PRO_TIER_LIMIT = 50;

export async function getUsageTracker() {

    const {has} = await auth();
    const hasProAccess = has({ plan: "pro" });
    const usageTracker = new RateLimiterPrisma({
        storeClient: prisma,
        tableName: 'Usage',
        points: hasProAccess? PRO_TIER_LIMIT : FREE_TIER_LIMIT, // Number of points
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



