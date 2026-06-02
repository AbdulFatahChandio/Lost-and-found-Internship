import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'prisma/prisma.service';
import { ITEM_MATCHING_QUEUE } from './constants/matching.constants';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';

@Module({
  imports: [
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
  controllers: [MatchingController],
  providers: [MatchingService, PrismaService],
  exports: [MatchingService, BullModule],
})
export class MatchingModule {}
