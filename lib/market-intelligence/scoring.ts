/**
 * Market Perception Scoring Service
 * Calculates Fairness Index, Safety Flags, and Confidence Scores.
 */

// Weightings for Fairness Index Categories (Total should sum to 1 approx, but we stick to logic)
const CATEGORY_WEIGHTS: Record<string, number> = {
    transparency: 1.5,
    paymentDiscipline: 2.0, // Critical
    support: 1.0,
    roleIntegrity: 1.5,
    onboarding: 1.0,
    safety: 2.0, // Critical
    compliance: 1.0,
};

export interface Ratings {
    transparency?: number;
    paymentDiscipline?: number;
    support?: number;
    roleIntegrity?: number;
    onboarding?: number;
    safety?: number;
    compliance?: number;
    [key: string]: number | undefined;
}

export interface ProcessedScore {
    score: number; // 0-100
    label: string; // "Excellent", "Good", "Risk", etc.
}

/**
 * Calculates a consolidated 0-100 score from 1-5 ratings.
 */
export function calculateFairnessIndex(ratings: Ratings): number {
    let totalWeightedScore = 0;
    let totalMaxWeightedScore = 0;

    for (const [key, weight] of Object.entries(CATEGORY_WEIGHTS)) {
        const rating = ratings[key];
        if (rating !== undefined && rating > 0) {
            totalWeightedScore += rating * weight;
            totalMaxWeightedScore += 5 * weight;
        }
    }

    if (totalMaxWeightedScore === 0) return 0;

    // Normalize to 0-100
    return Math.round((totalWeightedScore / totalMaxWeightedScore) * 100);
}

/**
 * Risk Flag Thresholds
 */
const RISK_THRESHOLDS = {
    PAYMENT: 2.5, // 5-star scale equivalent
    SAFETY: 3.0,
    SCOPE: 2.0
};

export interface RiskFlags {
    paymentRisk: boolean;
    safetyRisk: boolean; // Harassment/Toxicity
    scopeCreep: boolean;
    earlyTermination: boolean; // Calculated from placement data, not just ratings
}

export function detectRiskFlags(ratings: Ratings, tags: string[] = []): RiskFlags {
    return {
        paymentRisk: (ratings.paymentDiscipline || 5) < RISK_THRESHOLDS.PAYMENT || tags.includes('Late payment'),
        safetyRisk: (ratings.safety || 5) < RISK_THRESHOLDS.SAFETY || tags.includes('Unsafe environment'),
        scopeCreep: (ratings.roleIntegrity || 5) < RISK_THRESHOLDS.SCOPE || tags.includes('Role changed'),
        earlyTermination: tags.includes('Early termination'),
    };
}

/**
 * Calculate Confidence Score (0-1)
 * Based on N (sample size), recency, and consensus.
 */
export function calculateConfidenceScore(sampleSize: number, recentCount: number, variance: number): number {
    // Sigmoid-ish growth based on N
    // N=1 -> Low
    // N=5 -> Medium
    // N=20 -> High

    const nScore = Math.min(sampleSize / 20, 1.0); // Caps at 20 submissions
    const recencyBonus = Math.min(recentCount / 5, 0.2); // Up to 0.2 bonus for recent activity
    const consistencyPenalty = Math.min(variance, 0.3); // Penalty for high variance

    let score = nScore + recencyBonus - consistencyPenalty;
    return Math.max(0, Math.min(1, score)); // Clamp 0-1
}

export function getConfidenceLabel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
    if (score < 0.3) return 'LOW';
    if (score < 0.7) return 'MEDIUM';
    return 'HIGH';
}
