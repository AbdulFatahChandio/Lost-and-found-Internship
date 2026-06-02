import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MatchingWorkerModule } from './modules/matching/matching-worker.module';
import { WORKER_CONCURRENCY } from './modules/matching/constants/matching.constants';

async function bootstrap() {
  const logger = new Logger('MatchingWorker');

  const app = await NestFactory.createApplicationContext(MatchingWorkerModule, {
    logger: ['log', 'error', 'warn'],
  });

  logger.log(
    `Matching worker started (concurrency=${WORKER_CONCURRENCY} jobs per process)`,
  );
  logger.log('Start additional worker processes to scale parallel processing');

  process.on('SIGINT', async () => {
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });
}

bootstrap();
