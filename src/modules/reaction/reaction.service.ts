import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';

import { SetReactionDto } from './dto/set-reaction.dto';
import { ReactionType, User } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ReactionsService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async setReaction(postId: number, dto: SetReactionDto, currentUser: User) {
        const post = await this.prisma.post.findFirst({
            where: { id: postId, deletedAt: null },
            // select: { id: true },
        });
        console.log("🚀 ~ ReactionsService ~ setReaction ~ post:", post)
        if (!post) throw new NotFoundException('Post not found');


        const reaction = await this.prisma.reaction.upsert({
            where: {
                postId_userId: {
                    postId,
                    userId: currentUser.id,
                },
            },
            update: {
                type: dto.type,
            },
            create: {
                postId,
                userId: currentUser.id,
                type: dto.type,
            },
        });

        return reaction;
    }

    // REMOVE reaction
    async removeReaction(postId: number, currentUser: User) {
        const post = await this.prisma.post.findFirst({
            where: { id: postId, deletedAt: null },
            // select: { id: true },
        });
        console.log("🚀 ~ ReactionsService ~ setReaction ~ post:", post)
        if (!post) throw new NotFoundException('Post not found');

        await this.prisma.reaction
            .delete({
                where: {
                    postId_userId: { postId, userId:currentUser.id },
                },
            })
            .catch(() => null);

        return { success: true };
    }


    async getReactionsInfo(postId: number,currentUser:User) {
        const post = await this.prisma.post.findFirst({
            where: { id: postId, deletedAt: null },
            select: { id: true },
        });
        if (!post) throw new NotFoundException('Post not found');

        // counts per type
        const grouped = await this.prisma.reaction.groupBy({
            by: ['type'],
            where: { postId },
            _count: { _all: true },
        });

        const counts: Record<ReactionType, number> = {
            LIKE: 0,
            SAD: 0,
        } as any;

        grouped.forEach((g) => {
            counts[g.type] = g._count._all;
        });

        const total = grouped.reduce((sum, g) => sum + g._count._all, 0);

        let currentUserReaction: ReactionType | null = null;
        if (currentUser.id) {
            const userReaction = await this.prisma.reaction.findUnique({
                where: {
                    postId_userId: { postId, userId: currentUser.id },
                },
                select: { type: true },
            });
            currentUserReaction = userReaction?.type ?? null;
        }

        return {
            total,
            counts,
            currentUserReaction,
        };
    }
}
