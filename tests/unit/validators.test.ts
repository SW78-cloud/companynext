import { describe, it, expect } from 'vitest';
import { searchQuerySchema, reviewSchema, companyIdSchema } from '@/lib/validators';

describe('Validators', () => {
    describe('searchQuerySchema', () => {
        it('should validate valid search query', () => {
            const result = searchQuerySchema.parse({
                q: 'test company',
                limit: 10,
                offset: 0,
            });

            expect(result.q).toBe('test company');
            expect(result.limit).toBe(10);
            expect(result.offset).toBe(0);
        });

        it('should apply default values', () => {
            const result = searchQuerySchema.parse({ q: 'test' });

            expect(result.limit).toBe(10);
            expect(result.offset).toBe(0);
        });

        it('should reject empty query', () => {
            expect(() => searchQuerySchema.parse({ q: '' })).toThrow();
        });

        it('should reject query that is too long', () => {
            expect(() =>
                searchQuerySchema.parse({ q: 'a'.repeat(201) })
            ).toThrow();
        });
    });

    describe('reviewSchema', () => {
        it('should validate valid review', () => {
            const result = reviewSchema.parse({
                companyId: 'clxxx123456789',
                roleType: 'Employee',
                ratingsJson: { overall: 8, culture: 9 },
                redactedText: 'Great place to work',
            });

            expect(result.companyId).toBe('clxxx123456789');
            expect(result.roleType).toBe('Employee');
        });

        it('should allow optional fields', () => {
            const result = reviewSchema.parse({
                companyId: 'clxxx123456789',
                ratingsJson: { overall: 8 },
            });

            expect(result.roleType).toBeUndefined();
            expect(result.redactedText).toBeUndefined();
        });
    });

    describe('companyIdSchema', () => {
        it('should validate valid company ID', () => {
            const result = companyIdSchema.parse({ id: 'clxxx123456789' });
            expect(result.id).toBe('clxxx123456789');
        });

        it('should reject invalid ID format', () => {
            expect(() => companyIdSchema.parse({ id: 'invalid' })).toThrow();
        });
    });
});
