import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MatchStatus, PostType, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import {
  ITEM_MATCHING_QUEUE,
  MATCH_BATCH_SIZE,
  MATCH_MIN_SCORE,
} from './constants/matching.constants';
import { LostItemMatchJob, PostTextSnapshot } from './interfaces/match-job.interface';
import { chunkArray, computeSimilarity } from './utils/similarity.util';

@Injectable()
export class MatchingService {
  private readonly logger = new Logger(MatchingService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(ITEM_MATCHING_QUEUE) private readonly matchingQueue: Queue,
  ) {}

  /** Enqueue a background job when a new LOST item is reported */
  async enqueueLostItemMatch(lostPostId: number): Promise<void> {
    await this.matchingQueue.add(
      'match-lost-item',
      { lostPostId } satisfies LostItemMatchJob,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );

    this.logger.log(`Queued matching job for lost post #${lostPostId}`);
  }

  /**
   * Process a matching job: fetch all FOUND posts and compare in parallel batches.
   * Called by BullMQ worker process(es).
   */
  async processLostItemMatch(jobData: LostItemMatchJob): Promise<number> {
    const { lostPostId } = jobData;

    const lostPost = await this.prisma.post.findFirst({
      where: { id: lostPostId, type: PostType.LOST, deletedAt: null },
      select: { id: true, title: true, description: true },
    });

    if (!lostPost) {
      this.logger.warn(`Lost post #${lostPostId} not found or deleted; skipping`);
      return 0;
    }

    const foundPosts = await this.prisma.post.findMany({
      where: { type: PostType.FOUND, deletedAt: null },
      select: { id: true, title: true, description: true },
      orderBy: { createdAt: 'desc' },
    });

    if (foundPosts.length === 0) {
      this.logger.log(`No found posts to compare for lost post #${lostPostId}`);
      return 0;
    }

    const batches = chunkArray(foundPosts, MATCH_BATCH_SIZE);

    // Compare batches in parallel — each batch runs sequential comparisons internally
    const batchResults = await Promise.all(
      batches.map((batch) => this.compareBatch(lostPost, batch)),
    );

    const candidates = batchResults.flat().filter((c) => c.score >= MATCH_MIN_SCORE);

    if (candidates.length === 0) {
      this.logger.log(`No matches above threshold for lost post #${lostPostId}`);
      return 0;
    }

    await this.prisma.$transaction(
      candidates.map((candidate) =>
        this.prisma.itemMatch.upsert({
          where: {
            lostPostId_foundPostId: {
              lostPostId,
              foundPostId: candidate.foundPostId,
            },
          },
          update: { score: candidate.score },
          create: {
            lostPostId,
            foundPostId: candidate.foundPostId,
            score: candidate.score,
            status: MatchStatus.PENDING,
          },
        }),
      ),
    );

    this.logger.log(
      `Stored ${candidates.length} match(es) for lost post #${lostPostId}`,
    );

    return candidates.length;
  }

  private compareBatch(
    lostPost: PostTextSnapshot,
    foundBatch: PostTextSnapshot[],
  ): { foundPostId: number; score: number }[] {
    return foundBatch.map((found) => ({
      foundPostId: found.id,
      score: computeSimilarity(lostPost, found),
    }));
  }

  /** Get potential matches for a specific post (LOST or FOUND) */
  async getMatchesForPost(postId: number) {
    const post = await this.prisma.post.findFirst({
      where: { id: postId, deletedAt: null },
      select: { id: true, type: true, title: true },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const where =
      post.type === PostType.LOST
        ? { lostPostId: postId }
        : { foundPostId: postId };

    const matches = await this.prisma.itemMatch.findMany({
      where,
      orderBy: { score: 'desc' },
      include: {
        lostPost: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            createdAt: true,
            creator: { select: { id: true, name: true, email: true } },
          },
        },
        foundPost: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            createdAt: true,
            creator: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return {
      post,
      matches,
      total: matches.length,
    };
  }

  /** Get all matches for posts owned by the current user */
  async getMyMatches(currentUser: User, status?: MatchStatus) {
    const where: {
      lostPost: { creatorId: number; deletedAt: null };
      status?: MatchStatus;
    } = {
      lostPost: { creatorId: currentUser.id, deletedAt: null },
    };

    if (status) {
      where.status = status;
    }

    const matches = await this.prisma.itemMatch.findMany({
      where,
      orderBy: { score: 'desc' },
      include: {
        lostPost: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            createdAt: true,
          },
        },
        foundPost: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            createdAt: true,
            creator: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    return { matches, total: matches.length };
  }

  async updateMatchStatus(
    matchId: number,
    status: MatchStatus,
    currentUser: User,
  ) {
    const match = await this.prisma.itemMatch.findUnique({
      where: { id: matchId },
      include: { lostPost: { select: { creatorId: true } } },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.lostPost.creatorId !== currentUser.id) {
      throw new NotFoundException('Match not found');
    }

    return this.prisma.itemMatch.update({
      where: { id: matchId },
      data: { status },
    });
  }
}
