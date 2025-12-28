import prisma from '../../lib/db';
import type { HelloJobData } from '../index';
import type PgBoss from 'pg-boss';

export const HELLO_JOB = 'hello_job';

export async function helloJobHandler(jobs: PgBoss.Job<HelloJobData> | PgBoss.Job<HelloJobData>[]) {
    // Handle both single job and array of jobs
    const jobArray = Array.isArray(jobs) ? jobs : [jobs];

    for (const job of jobArray) {
        console.log('Processing hello job:', job.data);

        try {
            // Create an ingestion run record
            const ingestionRun = await prisma.ingestionRun.create({
                data: {
                    connectorName: 'hello_connector',
                    status: 'RUNNING',
                    startedAt: new Date(),
                },
            });

            // Simulate some work
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // Update ingestion run as completed
            await prisma.ingestionRun.update({
                where: { id: ingestionRun.id },
                data: {
                    status: 'COMPLETED',
                    finishedAt: new Date(),
                    addedCount: 1,
                    skippedCount: 0,
                    errorCount: 0,
                },
            });

            console.log('Hello job completed successfully');
        } catch (error) {
            console.error('Hello job failed:', error);
            throw error;
        }
    }
}
