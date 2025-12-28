export enum UserRole {
    VISITOR = 'VISITOR',
    EMPLOYEE = 'EMPLOYEE',
    CONTRACTOR = 'CONTRACTOR',
    ADMIN = 'ADMIN',
}

export type Permission =
    | 'view:public'
    | 'submit:review'
    | 'view:own-reviews'
    | 'manage:users'
    | 'manage:reviews'
    | 'view:admin';

const rolePermissions: Record<UserRole, Permission[]> = {
    [UserRole.VISITOR]: ['view:public'],
    [UserRole.EMPLOYEE]: ['view:public', 'submit:review', 'view:own-reviews'],
    [UserRole.CONTRACTOR]: ['view:public', 'submit:review', 'view:own-reviews'],
    [UserRole.ADMIN]: [
        'view:public',
        'submit:review',
        'view:own-reviews',
        'manage:users',
        'manage:reviews',
        'view:admin',
    ],
};

export function hasPermission(role: UserRole, permission: Permission): boolean {
    return rolePermissions[role]?.includes(permission) ?? false;
}

export function canAccessRoute(role: UserRole, path: string): boolean {
    // Public routes
    if (
        path === '/' ||
        path.startsWith('/search') ||
        path.startsWith('/company/') ||
        path.startsWith('/compare') ||
        path.startsWith('/sources') ||
        path.startsWith('/login') ||
        path.startsWith('/register')
    ) {
        return true;
    }

    // Protected app routes
    if (path.startsWith('/my-account') || path.startsWith('/submit-review')) {
        return hasPermission(role, 'submit:review');
    }

    // Admin routes
    if (path.startsWith('/admin')) {
        return hasPermission(role, 'view:admin');
    }

    return false;
}

export function requireRole(role: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
        [UserRole.VISITOR]: 0,
        [UserRole.EMPLOYEE]: 1,
        [UserRole.CONTRACTOR]: 1,
        [UserRole.ADMIN]: 2,
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
}
