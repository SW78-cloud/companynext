import prisma from './db';
import { Prisma } from '@prisma/client';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW';

export interface AuditLogData {
    actorUserId?: string;
    action: AuditAction;
    entityType: string;
    entityId: string;
    beforeJson?: Record<string, any>;
    afterJson?: Record<string, any>;
}

export async function createAuditLog(data: AuditLogData) {
    try {
        await prisma.auditLog.create({
            data: {
                actorUserId: data.actorUserId,
                action: data.action,
                entityType: data.entityType,
                entityId: data.entityId,
                beforeJson: (data.beforeJson ?? Prisma.JsonNull) as Prisma.InputJsonValue,
                afterJson: (data.afterJson ?? Prisma.JsonNull) as Prisma.InputJsonValue,
            },
        });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw - audit logging should not break the main operation
    }
}

export async function auditUpdate<T extends Record<string, any>>(
    actorUserId: string | undefined,
    entityType: string,
    entityId: string,
    before: T,
    after: T
) {
    await createAuditLog({
        actorUserId,
        action: 'UPDATE',
        entityType,
        entityId,
        beforeJson: before,
        afterJson: after,
    });
}

export async function auditCreate<T extends Record<string, any>>(
    actorUserId: string | undefined,
    entityType: string,
    entityId: string,
    data: T
) {
    await createAuditLog({
        actorUserId,
        action: 'CREATE',
        entityType,
        entityId,
        afterJson: data,
    });
}

export async function auditDelete<T extends Record<string, any>>(
    actorUserId: string | undefined,
    entityType: string,
    entityId: string,
    data: T
) {
    await createAuditLog({
        actorUserId,
        action: 'DELETE',
        entityType,
        entityId,
        beforeJson: data,
    });
}
