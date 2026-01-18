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
    isAnonymous: z.boolean(),
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

// Job Seeker Registration Validation
export const jobSeekerRegisterSchema = z.object({
    name: z.string().min(2, "First name must be at least 2 characters"),
    surname: z.string().min(2, "Surname must be at least 2 characters"),
    employmentType: z.enum(['PERMANENT', 'CONTRACTOR']),
    companyName: z.string().optional(),
    contractHouse: z.string().optional(),
    placedAtClient: z.string().optional(),
    email: z.string().email("Invalid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
}).superRefine((data, ctx) => {
    if (data.employmentType === 'PERMANENT') {
        if (!data.companyName || data.companyName.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Company name is required",
                path: ["companyName"],
            });
        }
    } else if (data.employmentType === 'CONTRACTOR') {
        if (!data.contractHouse || data.contractHouse.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Contract house is required",
                path: ["contractHouse"],
            });
        }
        if (!data.placedAtClient || data.placedAtClient.length < 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Client company is required",
                path: ["placedAtClient"],
            });
        }
    }
});

export type JobSeekerRegisterInput = z.infer<typeof jobSeekerRegisterSchema>;
