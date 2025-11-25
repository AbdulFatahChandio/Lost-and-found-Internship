import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { PostType, User } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'prisma/prisma.service';
import { QueryPostsDto } from './dto/query.dto';


@Injectable()
export class PostsService {
    constructor(private readonly prisma: PrismaService) { }

    // CREATE
    async create(dto: CreatePostDto, currentUser: User) {
        console.log("🚀 ~ PostsService ~ create ~ dto:", dto)

        const existingUser = await this.prisma.user.findUnique({
            where: { id: currentUser.id },
        });
        console.log("🚀 ~ PostsService ~ create ~ existingUser:", existingUser)

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }
        const post = await this.prisma.post.create({
            data: {
                title: dto.title,
                description: dto.description,
                type: dto.type,
                creatorId: existingUser.id
            },
        });

        return post;
    }

    // FIND ONE (by id)
    async findOne(id: number) {
        const post = await this.prisma.post.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                creator: {
                    select: { id: true, email: true, name: true },
                },
            },
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        return post;
    }

    // LIST with filters and pagination
    async findAll(query: QueryPostsDto) {
        const { page = 1, limit = 10, type, search, creatorId } = query;

        const where: any = {
            deletedAt: null,
        };

        if (type) {
            where.type = type;
        }

        if (creatorId) {
            where.creatorId = creatorId;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await this.prisma.$transaction([
            this.prisma.post.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    creator: {
                        select: { id: true, email: true, name: true },
                    },
                },
            }),
            this.prisma.post.count({ where }),
        ]);

        return {
            data: items,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // LIST LOST only
    async findLost(query: QueryPostsDto) {
        return this.findAll({ ...query, type: PostType.LOST });
    }

    // LIST FOUND only
    async findFound(query: QueryPostsDto) {
        return this.findAll({ ...query, type: PostType.FOUND });
    }

    // UPDATE (only creator)
    async update(id: number, dto: UpdatePostDto, currentUser: User) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: currentUser.id },
        });
        console.log("🚀 ~ PostsService ~ create ~ existingUser:", existingUser)

        const existing = await this.prisma.post.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) throw new NotFoundException('Post not found');

        if (existing.creatorId !== currentUser.id) {
            throw new ForbiddenException('You are not allowed to update this post');
        }

        const updated = await this.prisma.post.update({
            where: { id },
            data: {
                title: dto.title ?? existing.title,
                description: dto.description ?? existing.description,
                type: dto.type ?? existing.type,
            },
        });

        return updated;
    }

    // SOFT DELETE (only creator)
    async remove(id: number, currentUser: User) {
        const existingUser = await this.prisma.user.findUnique({
            where: { id: currentUser.id },
        });
        const existing = await this.prisma.post.findFirst({
            where: { id, deletedAt: null },
        });
        if (!existing) throw new NotFoundException('Post not found');

        if (existing.creatorId !== existingUser?.id) {
            throw new ForbiddenException('You are not allowed to delete this post');
        }

        await this.prisma.post.update({
            where: { id },
            data: { deletedAt: new Date() },
        });

        return { success: true };
    }
}
