import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCommentDto } from './dto/create-cooment.dto';
import { User } from '@prisma/client';

@Injectable()
export class CommentsService {
    private readonly maxDepth: number;

    constructor(
        private readonly prisma: PrismaService,
        private readonly config: ConfigService,
    ) {
        this.maxDepth = Number(this.config.get('MAX_COMMENT_DEPTH')) || 3;
    }


    async create(dto: CreateCommentDto, currentUser: User) {

        const post = await this.prisma.post.findFirst({
            where: { id: dto.postId, deletedAt: null },
            select: { id: true },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        const existingUser = await this.prisma.user.findUnique({
            where: { id: currentUser.id },
        });
        console.log("🚀 ~ PostsService ~ create ~ existingUser:", existingUser)

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        let depth = 1;

        if (dto.parentId) {
            const parent = await this.prisma.comment.findUnique({
                where: { id: dto.parentId },
            });

            if (!parent || parent.postId !== dto.postId) {
                throw new BadRequestException('Invalid parent comment');
            }

            depth = parent.depth + 1;

            if (depth > this.maxDepth) {
                throw new BadRequestException(
                    `Maximum comment nesting depth of ${this.maxDepth} exceeded`,
                );
            }
        }


        const comment = await this.prisma.comment.create({
            data: {
                postId: dto.postId,
                authorId: currentUser.id,
                parentId: dto.parentId ?? null,
                depth,
                content: dto.content,
            },
            include: {
                author: { select: { id: true, name: true } },
            },
        });

        return comment;
    }

    async listForPost(postId: number) {

        const comments = await this.prisma.comment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: {
                author: { select: { id: true, name: true } },
            },
        });


        const mapped = comments.map((c) => ({
            id: c.id,
            postId: c.postId,
            author: c.author,
            parentId: c.parentId,
            depth: c.depth,
            content: c.deletedAt ? '[deleted]' : c.content,
            isDeleted: !!c.deletedAt,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            replies: [] as any[],
        }));

        const byId: Record<number, any> = {};
        mapped.forEach((c) => (byId[c.id] = c));

        const roots: any[] = [];
        mapped.forEach((c) => {
            if (c.parentId) {
                const parent = byId[c.parentId];
                if (parent) parent.replies.push(c);
            } else {
                roots.push(c);
            }
        });

        return roots;
    }

    // UPDATE (only author)
    async update(commentId: number, dto: UpdateCommentDto, currentUser: User) {
        const existingComment = await this.prisma.comment.findFirst({
            where: {
                id: commentId,
                deletedAt: null,
            },
            select: { id: true, authorId: true },
        });

        if (!existingComment) {
            throw new NotFoundException('Comment not found');
        }
        if (existingComment.authorId !== currentUser.id) {
            throw new ForbiddenException('You can only edit your own comments');
        }

        const updated = await this.prisma.comment.update({
            where: { id: commentId },
            data: {
                content: dto.content,
            },
            include: {
                author: { select: { id: true, name: true } },
            },
        });

        return updated;
    }

    // DELETE (soft delete: mark as deleted, keep in thread)
    async delete(commentId: number, currentUser: User) {
        const existing = await this.prisma.comment.findUnique({
            where: { id: commentId },
        });

        if (!existing) {
            throw new NotFoundException('Comment not found');
        }
        if (existing.authorId !== currentUser.id) {
            throw new ForbiddenException('You can only delete your own comments');
        }

        await this.prisma.comment.update({
            where: { id: commentId },
            data: {
                deletedAt: new Date(),
                content: existing.content, 
            },
        });

        return { success: true };
    }
}
