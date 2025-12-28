import { currentUser } from '@clerk/nextjs/server';
import prisma from './db';
import { UserRole } from './rbac';

export async function getCurrentUser() {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    // Find or create user in database
    let user = await prisma.user.findUnique({
        where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
        // Create new user with default VISITOR role
        user = await prisma.user.create({
            data: {
                clerkUserId: clerkUser.id,
                email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
                role: UserRole.VISITOR,
            },
        });
    }

    return user;
}

export async function getUserRole(clerkUserId: string): Promise<UserRole> {
    const user = await prisma.user.findUnique({
        where: { clerkUserId },
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
