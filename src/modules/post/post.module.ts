import { Module } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';


@Module({
    controllers: [PostsController],
    providers: [PostsService, PrismaService],
})
export class PostModule { }
