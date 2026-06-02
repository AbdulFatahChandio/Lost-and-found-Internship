import { Module } from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { MatchingModule } from '../matching/matching.module';
import { PostsController } from './post.controller';
import { PostsService } from './post.service';


@Module({
    imports: [MatchingModule],
    controllers: [PostsController],
    providers: [PostsService, PrismaService],
})
export class PostModule { }
