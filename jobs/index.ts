import PgBoss from 'pg-boss';

let boss: PgBoss | null = null;

export async function getBoss(): Promise<PgBoss> {
    if (boss) {
        return boss;
    }

    boss = new PgBoss({
        connectionString: process.env.DATABASE_URL!,
        schema: 'pgboss',
    });

    boss.on('error', (error) => {
        console.error('pg-boss error:', error);
    });

    await boss.start();
    console.log('pg-boss started');

    return boss;
}

export async function stopBoss() {
    if (boss) {
        await boss.stop();
        boss = null;
        console.log('pg-boss stopped');
    }
}

// Job type definitions
export interface HelloJobData {
    message: string;
    timestamp: Date;
}

export type JobData = HelloJobData;
