/**
 * Market Perception Privacy Service
 * Handles PII scrubbing and K-Anonymity enforcement.
 */

export const K_THRESHOLD = 5;

// Simple regex-based PII scrubber (proof of concept)
// In production, use a more robust library or NLP model.
const PII_REGEX = {
    EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    PHONE: /(\+?27|0)[6-8][0-9]{8}/g, // Basic ZA phone regex
    ID_NUMBER: /\b\d{13}\b/g, // 13-digit SA ID
    EMP_NUMBER: /\b[A-Z]{2,3}\d{4,8}\b/g, // e.g. EMP12345
    NAMES: /\b(Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+\b/g, // Basic name title detection
};

export function scrubPII(text: string): string {
    if (!text) return text;
    let scrubbed = text;
    scrubbed = scrubbed.replace(PII_REGEX.EMAIL, '[EMAIL REMOVED]');
    scrubbed = scrubbed.replace(PII_REGEX.PHONE, '[PHONE REMOVED]');
    scrubbed = scrubbed.replace(PII_REGEX.ID_NUMBER, '[ID REMOVED]');
    scrubbed = scrubbed.replace(PII_REGEX.EMP_NUMBER, '[EMP# REMOVED]');
    scrubbed = scrubbed.replace(PII_REGEX.NAMES, '[NAME REMOVED]');
    return scrubbed;
}

export interface AggregationResult<T> {
    data: T | null;
    isAnonymized: boolean; // True if data is returned, false if hidden due to low sample size
    sampleSize: number;
}

/**
 * Enforces K-Anonymity. Returns null data if sample size < K.
 */
export function enforceKAnonymity<T>(data: T, sampleSize: number): AggregationResult<T> {
    if (sampleSize < K_THRESHOLD) {
        return {
            data: null,
            isAnonymized: false, // Hidden
            sampleSize
        };
    }
    return {
        data,
        isAnonymized: true, // Safe to show
        sampleSize
    };
}

/**
 * Checks if a specific feedback item's free text can be shown.
 * Requires strict K=10 for free text visibility as per requirements.
 */
export function canShowFreeText(sampleSize: number): boolean {
    return sampleSize >= 10;
}
