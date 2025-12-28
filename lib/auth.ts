import prisma from './db';
import { UserRole } from './rbac';
import { getSession } from './auth-session';

export async function getCurrentUser() {
    const session = await getSession();
    if (!session || !session.userId) return null;

    const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
            updatedAt: true
            // Exclude passwordHash
        }
    });

    return user;
}

export async function getUserRole(userId: string): Promise<UserRole> {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
    });

    return (user?.role as UserRole) ?? UserRole.VISITOR;
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}

