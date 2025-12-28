import { getBoss, stopBoss, type HelloJobData } from './index';
import { HELLO_JOB, helloJobHandler } from './definitions/hello-job';

async function main() {
    console.log('Starting pg-boss worker...');

    const boss = await getBoss();

    // Register job handlers
    await boss.work(HELLO_JOB, helloJobHandler);

    console.log('Worker is ready and listening for jobs');
    console.log(`Registered jobs: ${HELLO_JOB}`);

    // Schedule a demo job to run every 5 minutes
    await boss.schedule(HELLO_JOB, '*/5 * * * *', {
        message: 'Scheduled hello job',
        timestamp: new Date(),
    });

    console.log('Scheduled hello job to run every 5 minutes');

    // Graceful shutdown
    process.on('SIGTERM', async () => {
        console.log('SIGTERM received, shutting down gracefully...');
        await stopBoss();
        process.exit(0);
    });

    process.on('SIGINT', async () => {
        console.log('SIGINT received, shutting down gracefully...');
        await stopBoss();
        process.exit(0);
    });
}

main().catch((error) => {
    console.error('Worker failed to start:', error);
    process.exit(1);
});
