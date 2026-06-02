import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  ITEM_MATCHING_QUEUE,
  WORKER_CONCURRENCY,
} from './constants/matching.constants';
import { LostItemMatchJob } from './interfaces/match-job.interface';
import { MatchingService } from './matching.service';

@Processor(ITEM_MATCHING_QUEUE, { concurrency: WORKER_CONCURRENCY })
export class MatchingProcessor extends WorkerHost {
  private readonly logger = new Logger(MatchingProcessor.name);

  constructor(private readonly matchingService: MatchingService) {
    super();
  }

  async process(job: Job<LostItemMatchJob>): Promise<{ matchCount: number }> {
    this.logger.log(
      `Worker processing job ${job.id} for lost post #${job.data.lostPostId}`,
    );

    const matchCount = await this.matchingService.processLostItemMatch(job.data);

    return { matchCount };
  }
}
