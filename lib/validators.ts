import { z } from 'zod';

// Company search validation
export const searchQuerySchema = z.object({
    q: z.string().min(1).max(200),
    limit: z.coerce.number().min(1).max(100).optional().default(10),
    offset: z.coerce.number().min(0).optional().default(0),
});

// Review submission validation
export const reviewSchema = z.object({
    companyId: z.string().cuid(),
    employmentType: z.enum(['PERM', 'CONTRACTOR']),
    isAnonymous: z.boolean().default(true),
    title: z.string().min(2).max(100).optional(),
    body: z.string().min(10).max(5000).optional(),
    ratingsJson: z.record(z.union([z.number(), z.string(), z.boolean()])),

    // Location (optional)
    city: z.string().max(100).optional(),
    province: z.string().max(100).optional(),

    // Dates (optional)
    dates: z.object({
        startMonth: z.string().regex(/^\d{4}-\d{2}$/).optional(),
        endMonth: z.string().regex(/^\d{4}-\d{2}$/).optional(),
    }).optional(),

    // Legacy mapping (optional)
    roleType: z.string().min(1).max(100).optional(),
    redactedText: z.string().max(5000).optional(),
});

// Company metrics query validation
export const companyIdSchema = z.object({
    id: z.string().cuid(),
});

// Case records query validation
export const caseRecordsQuerySchema = z.object({
    id: z.string().cuid(),
    limit: z.coerce.number().min(1).max(100).optional().default(20),
    offset: z.coerce.number().min(0).optional().default(0),
    year: z.coerce.number().min(1900).max(2100).optional(),
    source: z.string().optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type CompanyId = z.infer<typeof companyIdSchema>;
export type CaseRecordsQuery = z.infer<typeof caseRecordsQuerySchema>;
