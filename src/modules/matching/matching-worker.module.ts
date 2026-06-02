import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { ITEM_MATCHING_QUEUE } from './constants/matching.constants';
import { MatchingProcessor } from './matching.processor';
import { MatchingService } from './matching.service';

/**
 * Worker-only module: registers the BullMQ processor without HTTP controllers.
 * Run via: pnpm run start:worker
 * Scale horizontally by starting multiple worker processes.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST', 'localhost'),
          port: config.get<number>('REDIS_PORT', 6379),
          password: config.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({ name: ITEM_MATCHING_QUEUE }),
  ],
  providers: [MatchingProcessor, MatchingService, PrismaService],
})
export class MatchingWorkerModule {}
