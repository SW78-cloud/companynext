import { describe, it, expect } from 'vitest';
import { UserRole, hasPermission, canAccessRoute, requireRole } from '@/lib/rbac';

describe('RBAC', () => {
    describe('hasPermission', () => {
        it('should allow visitor to view public content', () => {
            expect(hasPermission(UserRole.VISITOR, 'view:public')).toBe(true);
        });

        it('should not allow visitor to submit reviews', () => {
            expect(hasPermission(UserRole.VISITOR, 'submit:review')).toBe(false);
        });

        it('should allow employee to submit reviews', () => {
            expect(hasPermission(UserRole.EMPLOYEE, 'submit:review')).toBe(true);
        });

        it('should allow contractor to submit reviews', () => {
            expect(hasPermission(UserRole.CONTRACTOR, 'submit:review')).toBe(true);
        });

        it('should allow admin to manage users', () => {
            expect(hasPermission(UserRole.ADMIN, 'manage:users')).toBe(true);
        });

        it('should not allow employee to manage users', () => {
            expect(hasPermission(UserRole.EMPLOYEE, 'manage:users')).toBe(false);
        });
    });

    describe('canAccessRoute', () => {
        it('should allow all users to access public routes', () => {
            expect(canAccessRoute(UserRole.VISITOR, '/')).toBe(true);
            expect(canAccessRoute(UserRole.VISITOR, '/search')).toBe(true);
            expect(canAccessRoute(UserRole.VISITOR, '/company/123')).toBe(true);
        });

        it('should not allow visitor to access protected routes', () => {
            expect(canAccessRoute(UserRole.VISITOR, '/my-account')).toBe(false);
            expect(canAccessRoute(UserRole.VISITOR, '/submit-review')).toBe(false);
        });

        it('should allow employee to access protected routes', () => {
            expect(canAccessRoute(UserRole.EMPLOYEE, '/my-account')).toBe(true);
            expect(canAccessRoute(UserRole.EMPLOYEE, '/submit-review')).toBe(true);
        });

        it('should only allow admin to access admin routes', () => {
            expect(canAccessRoute(UserRole.VISITOR, '/admin')).toBe(false);
            expect(canAccessRoute(UserRole.EMPLOYEE, '/admin')).toBe(false);
            expect(canAccessRoute(UserRole.ADMIN, '/admin')).toBe(true);
        });
    });

    describe('requireRole', () => {
        it('should allow admin to access all roles', () => {
            expect(requireRole(UserRole.ADMIN, UserRole.VISITOR)).toBe(true);
            expect(requireRole(UserRole.ADMIN, UserRole.EMPLOYEE)).toBe(true);
            expect(requireRole(UserRole.ADMIN, UserRole.ADMIN)).toBe(true);
        });

        it('should allow employee to access visitor role', () => {
            expect(requireRole(UserRole.EMPLOYEE, UserRole.VISITOR)).toBe(true);
        });

        it('should not allow visitor to access employee role', () => {
            expect(requireRole(UserRole.VISITOR, UserRole.EMPLOYEE)).toBe(false);
        });
    });
});
